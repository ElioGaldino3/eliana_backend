import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ClientRepository } from './client.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { CreateClientDto } from './dto/create.client.dto';
import { UpdateClientDto } from './dto/update.client.dto';
@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(ClientRepository)
    private clientRepository: ClientRepository,
  ) {}

  async getClients(): Promise<Client[]> {
    return this.clientRepository.find({ order: { name: 'ASC' } });
  }

  async getClientById(id: number): Promise<Client> {
    const found = await this.clientRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(
        'Cliente com o id "' + id + '" não foi encontrado',
      );
    }

    return found;
  }

  async createClient(createClientDto: CreateClientDto): Promise<Client> {
    const client = new Client();
    const { name, phone, photoUrl } = createClientDto;

    if (!name) {
      throw new BadRequestException();
    }

    client.name = name;
    client.phone = phone || '';
    client.photoUrl = photoUrl;

    await client.save();

    return client;
  }

  async deleteClient(id: number): Promise<void> {
    const client = await this.getClientById(id);

    await client.remove();
  }

  async updateClient(
    id: number,
    updateClientDto: UpdateClientDto,
  ): Promise<void> {
    const client = await this.getClientById(id);

    if (updateClientDto.name) {
      client.name = updateClientDto.name;
    }
    if (updateClientDto.phone) {
      client.phone = updateClientDto.phone;
    }
    if (updateClientDto.photoUrl) {
      client.photoUrl = updateClientDto.photoUrl;
    }

    await client.save();
  }
}
