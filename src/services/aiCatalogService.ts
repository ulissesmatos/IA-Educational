/**
 * AI Catalog Service - Gerencia categorias e ferramentas de IA
 */

import { prisma } from '../db.js';
import type { PricingType } from '@prisma/client';

// Tipos para exportar
export interface AiCategoryInfo {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
  toolCount: number;
}

export interface AiToolInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string;
  url: string;
  logoUrl: string | null;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  pricingType: PricingType;
  pricingDetails: string | null;
  features: string[];
  pros: string[];
  cons: string[];
  useCases: string[];
  isFeatured: boolean;
}

export interface AiToolDetail extends AiToolInfo {
  category: AiCategoryInfo;
}

export interface CatalogFilters {
  categorySlug?: string;
  pricingType?: PricingType;
  featured?: boolean;
  search?: string;
}

export class AiCatalogService {
  
  /**
   * Busca todas as categorias ativas com contagem de ferramentas
   */
  async getCategories(): Promise<AiCategoryInfo[]> {
    const categories = await prisma.aiCategory.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: {
          select: { tools: { where: { isActive: true } } },
        },
      },
    });

    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      description: cat.description,
      toolCount: cat._count.tools,
    }));
  }

  /**
   * Busca uma categoria pelo slug
   */
  async getCategoryBySlug(slug: string): Promise<AiCategoryInfo | null> {
    const category = await prisma.aiCategory.findUnique({
      where: { slug, isActive: true },
      include: {
        _count: {
          select: { tools: { where: { isActive: true } } },
        },
      },
    });

    if (!category) return null;

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      description: category.description,
      toolCount: category._count.tools,
    };
  }

  /**
   * Busca todas as ferramentas com filtros opcionais
   */
  async getTools(filters: CatalogFilters = {}): Promise<AiToolInfo[]> {
    const where: any = { isActive: true };

    // Filtro por categoria
    if (filters.categorySlug) {
      const category = await prisma.aiCategory.findUnique({
        where: { slug: filters.categorySlug },
      });
      if (category) {
        where.categoryId = category.id;
      }
    }

    // Filtro por tipo de preço
    if (filters.pricingType) {
      where.pricingType = filters.pricingType;
    }

    // Filtro por destaque
    if (filters.featured !== undefined) {
      where.isFeatured = filters.featured;
    }

    // Filtro por busca (nome ou descrição)
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { shortDesc: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const tools = await prisma.aiTool.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { orderIndex: 'asc' },
        { name: 'asc' },
      ],
      include: {
        category: true,
      },
    });

    return tools.map(tool => ({
      id: tool.id,
      name: tool.name,
      slug: tool.slug,
      description: tool.description,
      shortDesc: tool.shortDesc,
      url: tool.url,
      logoUrl: tool.logoUrl,
      categoryId: tool.categoryId,
      categoryName: tool.category.name,
      categoryIcon: tool.category.icon,
      pricingType: tool.pricingType,
      pricingDetails: tool.pricingDetails,
      features: tool.features,
      pros: tool.pros,
      cons: tool.cons,
      useCases: tool.useCases,
      isFeatured: tool.isFeatured,
    }));
  }

  /**
   * Busca ferramentas em destaque
   */
  async getFeaturedTools(): Promise<AiToolInfo[]> {
    return this.getTools({ featured: true });
  }

  /**
   * Busca ferramentas por categoria
   */
  async getToolsByCategory(categorySlug: string): Promise<AiToolInfo[]> {
    return this.getTools({ categorySlug });
  }

  /**
   * Busca uma ferramenta pelo slug com detalhes completos
   */
  async getToolBySlug(slug: string): Promise<AiToolDetail | null> {
    const tool = await prisma.aiTool.findUnique({
      where: { slug, isActive: true },
      include: {
        category: {
          include: {
            _count: {
              select: { tools: { where: { isActive: true } } },
            },
          },
        },
      },
    });

    if (!tool) return null;

    return {
      id: tool.id,
      name: tool.name,
      slug: tool.slug,
      description: tool.description,
      shortDesc: tool.shortDesc,
      url: tool.url,
      logoUrl: tool.logoUrl,
      categoryId: tool.categoryId,
      categoryName: tool.category.name,
      categoryIcon: tool.category.icon,
      pricingType: tool.pricingType,
      pricingDetails: tool.pricingDetails,
      features: tool.features,
      pros: tool.pros,
      cons: tool.cons,
      useCases: tool.useCases,
      isFeatured: tool.isFeatured,
      category: {
        id: tool.category.id,
        name: tool.category.name,
        slug: tool.category.slug,
        icon: tool.category.icon,
        description: tool.category.description,
        toolCount: tool.category._count.tools,
      },
    };
  }

  /**
   * Busca ferramentas relacionadas (mesma categoria)
   */
  async getRelatedTools(toolSlug: string, limit = 4): Promise<AiToolInfo[]> {
    const tool = await prisma.aiTool.findUnique({
      where: { slug: toolSlug },
    });

    if (!tool) return [];

    const relatedTools = await prisma.aiTool.findMany({
      where: {
        categoryId: tool.categoryId,
        isActive: true,
        slug: { not: toolSlug },
      },
      take: limit,
      orderBy: [
        { isFeatured: 'desc' },
        { orderIndex: 'asc' },
      ],
      include: {
        category: true,
      },
    });

    return relatedTools.map(t => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      description: t.description,
      shortDesc: t.shortDesc,
      url: t.url,
      logoUrl: t.logoUrl,
      categoryId: t.categoryId,
      categoryName: t.category.name,
      categoryIcon: t.category.icon,
      pricingType: t.pricingType,
      pricingDetails: t.pricingDetails,
      features: t.features,
      pros: t.pros,
      cons: t.cons,
      useCases: t.useCases,
      isFeatured: t.isFeatured,
    }));
  }

  /**
   * Conta total de ferramentas por tipo de preço
   */
  async getStatsByPricing(): Promise<Record<PricingType, number>> {
    const stats = await prisma.aiTool.groupBy({
      by: ['pricingType'],
      where: { isActive: true },
      _count: true,
    });

    const result: Record<string, number> = {
      FREE: 0,
      FREEMIUM: 0,
      PAID: 0,
    };

    for (const stat of stats) {
      result[stat.pricingType] = stat._count;
    }

    return result as Record<PricingType, number>;
  }
}

// Exportar instância singleton
export const aiCatalogService = new AiCatalogService();
