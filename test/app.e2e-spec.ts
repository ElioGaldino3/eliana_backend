import * as request from 'supertest';
import { RegisterDTO, LoginDTO } from 'src/modules/auth/dtos/user.dto';
import { Client } from 'pg';
import { CreateClientDto } from 'src/modules/clients/dto/create.client.dto';
import { UpdateClientDto } from 'src/modules/clients/dto/update.client.dto';
import { CreateProductDto } from 'src/modules/products/dto/create.product.dto';
import { UpdateProductDto } from 'src/modules/products/dto/update.product.dto';
import { CreateBillingDTO } from 'src/modules/billing/billing.dto';

const app = 'http://localhost:4565';

let token = '';
let clientForTestOrder = 1;
let productForTestOrder = 1;

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
        clientForTestOrder = body.id;
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
      .expect(({ body }) => {
        expect(body.length >= 1).toEqual(true);
      });
  });

  it('should update client', () => {
    const updateClient: UpdateClientDto = {
      name: 'NewName',
    };

    return request(app)
      .patch(`/clients/${clientId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateClient)
      .expect(200);
  });

  it('should delete client', () => {
    return request(app)
      .delete(`/clients/${clientId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});

describe('-- PRODUCT MODULE --', () => {
  let productId = 1;

  it('should create a new product', () => {
    const newProduct: CreateProductDto = {
      name: 'Product Name',
      value: '1.25',
      isRent: false,
    };

    return request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send(newProduct)
      .expect(201)
      .expect(({ body }) => {
        productId = body.id;
        expect(body.name).toEqual(newProduct.name);
      });
  });

  it('should create product without isRent', () => {
    return request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Product Name', value: '1.25' })
      .expect(201)
      .expect(({ body }) => {
        productForTestOrder = body.id;
        expect(body.name).toEqual('New Product Name');
      });
  });

  it('should create a new user with invalid number', () => {
    const newProduct: CreateProductDto = {
      name: 'Product Name',
      value: '1,25',
      isRent: false,
    };

    return request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send(newProduct)
      .expect(400);
  });

  it('should create a new user without value', () => {
    return request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test' })
      .expect(400);
  });

  it('should create a new user without data', () => {
    return request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('should get product list', () => {
    return request(app)
      .get('/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.length >= 1).toEqual(true);
      });
  });

  it('should update product', () => {
    const updatedProduct: UpdateProductDto = {
      name: 'Test Product Name',
    };

    return request(app)
      .patch(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedProduct)
      .expect(200);
  });

  it('should delete product', () => {
    return request(app)
      .delete(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});

describe('-- ORDER MODULE --', () => {
  let orderId = 1;
  let orderIdForDelete = 2;
  it('should create a new order', () => {
    const newOrder = {
      dateDelivery: '2020-11-03',
      comment: 'test coment',
      clientId: clientForTestOrder,
      products: [{ productId: productForTestOrder, amount: 1 }],
      isRent: 'false',
    };

    return request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send(newOrder)
      .expect(201)
      .expect(({ body }) => {
        orderId = body.id;
        expect(body.products.length >= 1).toEqual(true);
        expect(body.clientId).toEqual(clientForTestOrder);
        expect(body.id).toBeDefined();
      });
  });

  it('should create a new order without isRent', () => {
    const newOrder = {
      dateDelivery: '2020-11-03',
      comment: 'test coment',
      clientId: clientForTestOrder,
      products: [{ productId: productForTestOrder, amount: 1 }],
    };

    return request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send(newOrder)
      .expect(201)
      .expect(({ body }) => {
        orderIdForDelete = body.id;
        expect(body.isRent).toEqual(false);
      });
  });

  it('should update order', () => {
    const updatedOrder = {
      dateDelivery: '2020-04-04',
      comment: 'update comment',
      //clientId: clientForTestOrder
      products: [{ productId: productForTestOrder, amount: 2 }],
      isRent: true,
    };

    return request(app)
      .patch(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedOrder)
      .expect(200)
      .expect(({ body }) => {
        expect(body.products[0].amount).toEqual(2);
        expect(body.client.id).toEqual(clientForTestOrder);
        expect(body.dateDelivery).toEqual('2020-04-04');
        expect(body.comment).toEqual('update comment');
        expect(body.id).toBeDefined();
      });
  });

  it('should list of orders', () => {
    return request(app)
      .get(`/orders`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.length >= 1).toEqual(true);
      });
  });

  it('should deliver order', () => {
    return request(app)
      .patch(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.isDelivery).toEqual(true);
      });
  });

  it('should delete order', () => {
    return request(app)
      .delete(`/orders/${orderIdForDelete}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});

describe('-- BILLING MODULE --', () => {
  let billingId = 1;

  it('should create a new billing', () => {
    const newBilling: CreateBillingDTO = {
      content: 'content',
      value: 1.25,
    };

    return request(app)
      .post('/billings')
      .set('Authorization', `Bearer ${token}`)
      .send(newBilling)
      .expect(201)
      .expect(({ body }) => {
        billingId = body.id;
        expect(body.content).toEqual(newBilling.content);
      });
  });

  it('should create billing without content', () => {
    return request(app)
      .post('/billings')
      .set('Authorization', `Bearer ${token}`)
      .send({ value: 1.25 })
      .expect(201)
      .expect(({ body }) => {
        expect(body.value).toEqual("1.25");
      });
  });

  it('should create a new billing without value', () => {
    return request(app)
      .post('/billings')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Test' })
      .expect(400);
  });

  it('should create a new billing without data', () => {
    return request(app)
      .post('/billings')
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('should get billing list', () => {
    return request(app)
      .get('/billings')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.length >= 1).toEqual(true);
      });
  });

  it('should delete billing', () => {
    return request(app)
      .delete(`/billings/${billingId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});


afterAll(async () => {
  conDB.end();
});
