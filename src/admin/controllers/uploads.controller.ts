import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

export class UploadsController {
  /**
   * Busca recursiva por arquivos em um diretório
   */
  private static getAllFiles(dirPath: string, relativeTo: string = dirPath): string[] {
    const files: string[] = [];

    if (!fs.existsSync(dirPath)) {
      return files;
    }

    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      if (item === '.gitkeep') continue;

      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Busca recursiva em subdiretórios
        files.push(...this.getAllFiles(fullPath, relativeTo));
      } else if (stat.isFile()) {
        // Adiciona arquivo relativo ao diretório base
        files.push(path.relative(relativeTo, fullPath));
      }
    }

    return files;
  }

  /**
   * GET /admin/uploads
   * Lista todos os arquivos na pasta uploads (busca recursiva)
   */
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const files = this.getAllFiles(uploadsDir);

      const items = files
        .map((relativePath) => {
          const filePath = path.join(uploadsDir, relativePath);
          let stat: fs.Stats | null = null;
          try { stat = fs.statSync(filePath); } catch (e) { stat = null; }
          return {
            filename: relativePath,
            url: `/uploads/${relativePath.replace(/\\/g, '/')}`, // Normalizar para URLs
            size: stat ? stat.size : null,
            mtime: stat ? stat.mtime : null
          };
        })
        .sort((a, b) => (b.mtime && a.mtime ? b.mtime.getTime() - a.mtime.getTime() : 0));

      res.render('admin/uploads/list', {
        title: 'Uploads',
        currentPage: 'uploads',
        items,
      });
    } catch (error) {
      console.error('Erro ao listar uploads:', error);
      res.status(500).send('Erro ao listar uploads');
    }
  }

  /**
   * POST /admin/uploads/:filename/delete
   * Remove um arquivo (caminhos relativos seguros, evita traversal)
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      // Decodificar o filename que pode conter subdiretórios
      const filename = decodeURIComponent(req.params.filename);

      // Validar que o caminho é seguro (não contém .. ou / absolutos)
      if (filename.includes('..') || filename.startsWith('/') || filename.startsWith('\\')) {
        res.status(400).send('Caminho inválido');
        return;
      }

      const filePath = path.join(uploadsDir, filename);

      // Verificar se o arquivo existe e está dentro do diretório uploads
      if (!fs.existsSync(filePath) || !filePath.startsWith(uploadsDir)) {
        res.status(404).send('Arquivo não encontrado');
        return;
      }

      // Verificar se é um arquivo (não diretório)
      const stat = fs.statSync(filePath);
      if (!stat.isFile()) {
        res.status(400).send('Apenas arquivos podem ser deletados');
        return;
      }

      fs.unlinkSync(filePath);
      res.redirect('/admin/uploads');
    } catch (error) {
      console.error('Erro ao deletar upload:', error);
      res.status(500).send('Erro ao deletar arquivo');
    }
  }
}
