import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

export class UploadsController {
  /**
   * GET /admin/uploads
   * Lista todos os arquivos na pasta uploads
   */
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const files = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir) : [];

      const items = files
        .filter((f) => f !== '.gitkeep')
        .map((filename) => {
          const filePath = path.join(uploadsDir, filename);
          let stat: fs.Stats | null = null;
          try { stat = fs.statSync(filePath); } catch (e) { stat = null; }
          return {
            filename,
            url: `/uploads/${filename}`,
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
   * Remove um arquivo (somente nomes baseados, evita traversal)
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const filename = path.basename(req.params.filename);
      const filePath = path.join(uploadsDir, filename);

      if (!fs.existsSync(filePath)) {
        res.status(404).send('Arquivo não encontrado');
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
