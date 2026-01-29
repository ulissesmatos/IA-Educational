import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Serviço de autenticação de usuários admin
 */
export class AuthService {
  private static readonly SALT_ROUNDS = 12;

  /**
   * Cria hash seguro de senha usando bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Verifica se a senha corresponde ao hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Autentica usuário admin por email e senha
   * @returns Dados do usuário se autenticado, null caso contrário
   */
  static async authenticate(email: string, password: string) {
    try {
      // Busca usuário pelo email
      const user = await prisma.adminUser.findUnique({
        where: { email: email.toLowerCase().trim() },
        select: {
          id: true,
          email: true,
          name: true,
          passwordHash: true,
          isActive: true
        }
      });

      // Usuário não encontrado
      if (!user) {
        return null;
      }

      // Usuário desativado
      if (!user.isActive) {
        return null;
      }

      // Verifica senha
      const isValidPassword = await this.verifyPassword(password, user.passwordHash);
      if (!isValidPassword) {
        return null;
      }

      // Atualiza último login
      await prisma.adminUser.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      // Retorna dados do usuário (sem hash de senha)
      return {
        id: user.id,
        email: user.email,
        name: user.name
      };
    } catch (error) {
      console.error('Erro na autenticação:', error);
      return null;
    }
  }

  /**
   * Cria ou atualiza o usuário admin
   * ATENÇÃO: Use apenas via script de setup, não expor via API
   */
  static async createAdminUser(email: string, password: string, name: string) {
    const passwordHash = await this.hashPassword(password);
    
    return prisma.adminUser.upsert({
      where: {
        email: email.toLowerCase().trim()
      },
      update: {
        passwordHash,
        name: name.trim()
      },
      create: {
        email: email.toLowerCase().trim(),
        passwordHash,
        name: name.trim()
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });
  }

  /**
   * Lista todos os usuários admin (sem hashes de senha)
   */
  static async listAdminUsers() {
    return prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Desativa usuário admin (soft delete)
   */
  static async deactivateUser(userId: string) {
    return prisma.adminUser.update({
      where: { id: userId },
      data: { isActive: false }
    });
  }
}
