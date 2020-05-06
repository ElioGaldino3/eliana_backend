import { Controller, Get, Param, ParseIntPipe, Post, Body, Patch, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ClientsService } from './clients.service'
import { Client } from './client.entity';
import { CreateClientDto } from './dto/create.client.dto';
import { UpdateClientDto } from './dto/update.client.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('clients')
@UseGuards(AuthGuard())
export class ClientsController {
  constructor(private clientsService: ClientsService) { }

  @Get()
  getClients(): Promise<Client[]> {
    return this.clientsService.getClients()
  }

  @Get('/:id')
  getClientById(@Param('id', ParseIntPipe) id: number): Promise<Client> {
    return this.clientsService.getClientById(id)
  }

  @Post()
  createClient(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientsService.createClient(createClientDto)
  }

  @Patch()
  async updateClient(@Body() updateClientDto: UpdateClientDto): Promise<void> {
    await this.clientsService.updateClient(updateClientDto)
  }

  @Delete('/:id')
  removeClient(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.clientsService.deleteClient(id)
  }

  @Post('/:id')
  @UseInterceptors(
    FileInterceptor('clients', {dest: '/uploads/clients'}),
  )
  async uploadedFile(@UploadedFile() file: any) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return response;
  }
}
