import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ClientRepository } from './client.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { CreateClientDto } from './dto/create.client.dto';
import { UpdateClientDto } from './dto/update.client.dto';
import { Cron } from '@nestjs/schedule';
import { writeFile } from 'fs';
import moment = require('moment');
@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);
  
  constructor(
    @InjectRepository(ClientRepository)
    private clientRepository: ClientRepository,
  ) { }

  async getClients(): Promise<Client[]> {
    return this.clientRepository.find({order: { name: "ASC" }})
  }

  async getClientById(id: number): Promise<Client> {
    const found = await this.clientRepository.findOne(id)

    if (!found) {
      throw new NotFoundException('Cliente com o id "' + id + '" não foi encontrado')
    }

    return found
  }

  async createClient(createClientDto: CreateClientDto): Promise<Client> {
    const client = new Client()
    const { name, phone, photoUrl } = createClientDto

    client.name = name
    client.phone = phone
    client.photoUrl = photoUrl

    await client.save()

    return client
  }

  async deleteClient(id: number): Promise<void> {
    const client = await this.getClientById(id)

    await client.remove()
  }

  async updateClient(updateClientDto: UpdateClientDto): Promise<void> {
    const client = await this.getClientById(updateClientDto.id)

    if (updateClientDto.name) { client.name = updateClientDto.name }
    if (updateClientDto.phone) { client.phone = updateClientDto.phone }
    if (updateClientDto.photoUrl) { client.photoUrl = updateClientDto.photoUrl }

    await client.save()
  }

  @Cron('* * 3 * * 1-6')
  async handleBackup() {
    const clients = JSON.stringify(await this.getClients());
    const path = process.env.BACKUP_PATH + `/${moment().format()}` + '.clients.json'
    writeFile(path, clients, 'utf8', err => {
      if (err) {
        this.logger.error(err);
      } else {
        this.logger.log("bfeg :D");
      }
    });
  }

}
