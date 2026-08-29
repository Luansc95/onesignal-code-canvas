/**
 * Centralized Project Management & Storage Service for OneSignal
 * Powers both the public portfolio and the protected /admin/projetos area.
 * Seeded with standard projects and persists all CRUD mutations locally.
 */

import { Project, ProjectCategory, ProjectType, ProjectStatus } from '../types';
import { PROJECTS_DATA } from '../data/projectsData';

const PROJECTS_STORAGE_KEY = 'onesignal_admin_projects_v2';

class ProjectService {
  private projects: Project[] = [];
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init(): void {
    if (this.isInitialized) return;
    if (typeof window === 'undefined') {
      this.projects = this.seedDefaults(PROJECTS_DATA);
      return;
    }

    try {
      const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (stored) {
        this.projects = JSON.parse(stored);
      } else {
        this.projects = this.seedDefaults(PROJECTS_DATA);
        this.persist();
      }
    } catch {
      this.projects = this.seedDefaults(PROJECTS_DATA);
    }
    this.isInitialized = true;
  }

  private seedDefaults(base: Project[]): Project[] {
    return base.map((p, index) => ({
      ...p,
      slug: p.id,
      isPublished: true,
      status: p.status || 'published',
      viewsCount: 140 + index * 42,
      createdAt: new Date(Date.now() - (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString()
    }));
  }

  private persist(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(this.projects));
    } catch (e) {
      console.warn('[OneSignal ProjectService] Storage warning:', e);
    }
  }

  public getAllProjects(): Project[] {
    this.init();
    return [...this.projects];
  }

  public getPublishedProjects(): Project[] {
    this.init();
    return this.projects.filter((p) => p.isPublished !== false && p.status !== 'draft' && p.status !== 'archived');
  }

  public getProjectBySlugOrId(identifier: string): Project | undefined {
    this.init();
    return this.projects.find((p) => p.id === identifier || p.slug === identifier);
  }

  public incrementViews(identifier: string): void {
    this.init();
    const project = this.projects.find((p) => p.id === identifier || p.slug === identifier);
    if (project) {
      project.viewsCount = (project.viewsCount || 0) + 1;
      this.persist();
    }
  }

  public createProject(newProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    this.init();
    const slug = newProject.slug || this.generateSlug(newProject.name);
    const created: Project = {
      ...newProject,
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      slug,
      isPublished: newProject.isPublished ?? true,
      status: newProject.status || 'published',
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.projects.unshift(created);
    this.persist();
    return created;
  }

  public updateProject(id: string, updates: Partial<Project>): Project | null {
    this.init();
    const idx = this.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    if (updates.name && !updates.slug) {
      updates.slug = this.generateSlug(updates.name);
    }

    const updated: Project = {
      ...this.projects[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.projects[idx] = updated;
    this.persist();
    return updated;
  }

  public duplicateProject(id: string): Project | null {
    this.init();
    const original = this.projects.find((p) => p.id === id);
    if (!original) return null;

    const duplicated: Project = {
      ...original,
      id: `proj_${Date.now()}_copy`,
      name: `${original.name} (Cópia)`,
      slug: `${original.slug || original.id}-copia-${Date.now().toString().slice(-4)}`,
      status: 'draft',
      isPublished: false,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.projects.unshift(duplicated);
    this.persist();
    return duplicated;
  }

  public togglePublish(id: string): Project | null {
    this.init();
    const project = this.projects.find((p) => p.id === id);
    if (!project) return null;

    const willPublish = !project.isPublished;
    project.isPublished = willPublish;
    project.status = willPublish ? 'published' : 'draft';
    project.updatedAt = new Date().toISOString();

    this.persist();
    return project;
  }

  public deleteProject(id: string): boolean {
    this.init();
    const initialLength = this.projects.length;
    this.projects = this.projects.filter((p) => p.id !== id);
    if (this.projects.length !== initialLength) {
      this.persist();
      return true;
    }
    return false;
  }

  public generateSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60);
  }

  public resetToDefaults(): void {
    this.projects = this.seedDefaults(PROJECTS_DATA);
    this.persist();
  }
}

export const projectService = new ProjectService();
