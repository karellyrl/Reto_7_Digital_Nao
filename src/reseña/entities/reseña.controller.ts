import { Controller, Get, Post, Delete, Put, Param, Body, UseGuards, Res, HttpException, HttpStatus } from '@nestjs/common';
import { ReseñaService } from './reseña.service';
import { Resena } from './reseña.entity';
import { CreateResenaDto, UpdateResenaDto } from './reseña.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Response } from 'express';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Reseñas') // Etiqueta para agrupar los endpoints en Swagger
@ApiBearerAuth()
@Controller('resenas')
export class ReseñaController {
  constructor(private readonly reseñaService: ReseñaService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Protege la ruta con el guard de JWT
  @ApiOperation({ summary: 'Crear una nueva reseña' })
  @ApiResponse({ status: 201, description: 'Reseña creada con éxito.', type: Resena })
  @ApiResponse({ status: 400, description: 'Error al crear la reseña.' })
  async create(@Body() createReseñaDto: CreateResenaDto, @Res() res: Response): Promise<Response> {
    try {
      const nuevaReseña = await this.reseñaService.create(createReseñaDto);
      return res.status(201).json({ message: 'Reseña creada con éxito.', data: nuevaReseña });
    } catch (error) {
      throw new HttpException('Error al crear la reseña.', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard) // Protege la ruta con el guard de JWT
  @ApiOperation({ summary: 'Obtener todas las reseñas' })
  @ApiResponse({ status: 200, description: 'Lista de todas las reseñas.', type: [Resena] })
  async findAll(@Res() res: Response): Promise<Response> {
    const reseñas = await this.reseñaService.findAll();
    return res.status(200).json({ message: 'Lista de todas las reseñas.', data: reseñas });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard) // Protege la ruta con el guard de JWT
  @ApiOperation({ summary: 'Obtener una reseña por ID' })
  @ApiResponse({ status: 200, description: 'Reseña encontrada.', type: Resena })
  @ApiResponse({ status: 404, description: 'Reseña no encontrada.' })
  async findOne(@Param('id') id: number, @Res() res: Response): Promise<Response> {
    const reseña = await this.reseñaService.findOne(id);
    if (reseña) {
      return res.status(200).json({ message: 'Reseña encontrada.', data: reseña });
    } else {
      throw new HttpException('Reseña no encontrada.', HttpStatus.NOT_FOUND);
    }
  }

  @Get('libro/:libroId')
  @UseGuards(JwtAuthGuard) // Protege la ruta con el guard de JWT
  @ApiOperation({ summary: 'Obtener reseñas asociadas a un libro' })
  @ApiResponse({ status: 200, description: 'Lista de reseñas del libro.', type: [Resena] })
  async findByLibro(@Param('libroId') libroId: number, @Res() res: Response): Promise<Response> {
    const reseñas = await this.reseñaService.findByLibro(libroId);
    return res.status(200).json({ message: 'Lista de reseñas del libro.', data: reseñas });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Protege la ruta con el guard de JWT
  @ApiOperation({ summary: 'Eliminar una reseña por ID' })
  @ApiResponse({ status: 200, description: 'Reseña eliminada con éxito.' })
  @ApiResponse({ status: 404, description: 'Reseña no encontrada.' })
  async remove(@Param('id') id: number, @Res() res: Response): Promise<Response> {
    try {
      await this.reseñaService.remove(id);
      return res.status(200).json({ message: `Reseña eliminada con éxito.` });
    } catch (error) {
      throw new HttpException('Reseña no encontrada.', HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard) // Protege la ruta con el guard de JWT
  @ApiOperation({ summary: 'Actualizar una reseña por ID' })
  @ApiResponse({ status: 200, description: 'Reseña actualizada con éxito.', type: Resena })
  @ApiResponse({ status: 404, description: 'Reseña no encontrada.' })
  async update(@Param('id') id: number, @Body() updateReseñaDto: UpdateResenaDto, @Res() res: Response): Promise<Response> {
    const reseñaActualizada = await this.reseñaService.update(id, updateReseñaDto);
    if (reseñaActualizada) {
      return res.status(200).json({ message: 'Reseña actualizada con éxito.', data: reseñaActualizada });
    } else {
      throw new HttpException('Reseña no encontrada.', HttpStatus.NOT_FOUND);
    }
  }
}
