import * as request from 'supertest';
import { RegisterDTO, LoginDTO } from 'src/modules/auth/dtos/user.dto';
import { Client } from 'pg';
import { CreateClientDto } from 'src/modules/clients/dto/create.client.dto';
import { UpdateClientDto } from 'src/modules/clients/dto/update.client.dto';

const app = 'http://localhost:4565';

let token = '';

const conDB = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'eliana_test',
  password: '7k7k7k7k',
  port: 5432,
});

beforeAll(async () => {
  await conDB.connect();
  conDB.query('DELETE FROM user_entity');
  conDB.query('DELETE FROM billing');
  conDB.query('DELETE FROM client');
  conDB.query('DELETE FROM product');
  conDB.query('DELETE FROM product_order');
});

describe('ROOT', () => {
  it('should ping', () => {
    return request(app)
      .get('/')
      .expect(404);
  });
});

describe('-- AUTH MODULE --', () => {
  const newUser: RegisterDTO = {
    username: 'eliogaldino',
    password: '12345',
  };

  const user: LoginDTO = {
    username: 'eliogaldino',
    password: '12345',
  };

  it('should register a new user', () => {
    return request(app)
      .post('/auth')
      .send(newUser)
      .expect(({ body }) => {
        expect(body.user.token.length > 190).toEqual(true);
        expect(body.user.username).toEqual(newUser.username);

        token = body.user.token;
      });
  });

  it('should return conflict error', () => {
    return request(app)
      .post('/auth')
      .send(newUser)
      .expect(409);
  });

  it('should login', () => {
    return request(app)
      .post('/auth/login')
      .send(user)
      .expect(({ body }) => {
        expect(body.user.token.length > 190).toEqual(true);
        expect(body.user.username).toEqual(newUser.username);
      });
  });

  it('should invalid credentials', () => {
    return request(app)
      .post('/auth/login')
      .send({ username: user.username, password: 'AIncorrentPassword' })
      .expect(({ body }) => {
        expect(body.message).toEqual('Invalid credentials');
      });
  });

  it('should get user info', () => {
    return request(app)
      .get('/auth')
      .set('Authorization', `Bearer ${token}`)
      .expect(({ body }) => {
        expect(body.username).toEqual(newUser.username);
        expect(body.isAuth).toEqual('false');
      });
  });
});

describe('-- CLIENT MODULE --', () => {
  let clientId = 1;

  beforeEach(() => {
    conDB.query(
      `UPDATE user_entity SET "isAuth" = 'true' WHERE username = 'eliogaldino'`,
    );
  });

  it('should create a new client', () => {
    const newClient: CreateClientDto = {
      name: 'Product Test',
      phone: '(99) 99977-7788',
    };

    return request(app)
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send(newClient)
      .expect(({ body }) => {
        expect(body.name).toEqual(newClient.name);
        clientId = body.id;
      });
  });

  it('should request without phone number', () => {
    return request(app)
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Product Test' })
      .expect(({ body }) => {
        expect(body.name).toEqual('Product Test');
      });
  });

  it('should request without product data', () => {
    return request(app)
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('should get a client list', () => {
    return request(app)
      .get('/clients')
      .set('Authorization', `Bearer ${token}`)
      .expect(({body}) => {
        expect(body.length >= 1).toEqual(true);
      });
  })

  it('should update client', () => {
    const updateClient: UpdateClientDto = {
      name: 'NewName'
    }

    return request(app)
      .patch(`/clients/${clientId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateClient)
      .expect(200);
  });
});

afterAll(async () => {
  conDB.end();
})
