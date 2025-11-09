import { server } from './server';
import type { User } from './models/user';

describe('User CRUD API', () => {
  let baseUrl: string;
  let createdUserId: string;

  beforeAll((done) => {
    const listener = server.listen(0, () => {
      const { port } = listener.address() as any;
      baseUrl = `http://localhost:${port}`;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it('GET /api/users -> []', async () => {
    const res = await fetch(`${baseUrl}/api/users`);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual([]);
  });

  it('POST /api/users -> create new user', async () => {
    const newUser = { username: 'Alex', age: 35, hobbies: ['reading'] };
    const res = await fetch(`${baseUrl}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    const data = (await res.json()) as User;

    expect(res.status).toBe(201);
    expect(data?.username).toBe('Alex');
    expect(data?.id).toBeDefined();
    createdUserId = data.id;
  });

  it('GET /api/users/:id -> get created user', async () => {
    const res = await fetch(`${baseUrl}/api/users/${createdUserId}`);
    const data = (await res.json()) as User;

    expect(res.status).toBe(200);
    expect(data?.id).toBe(createdUserId);
    expect(data?.username).toBe('Alex');
  });

  it('PUT /api/users/:id -> update user', async () => {
    const updatedUser = { username: 'Karl Marks', age: 26, hobbies: [] };
    const res = await fetch(`${baseUrl}/api/users/${createdUserId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser),
    });
    const data = (await res.json()) as User;
    expect(res.status).toBe(200);
    expect(data?.username).toBe('Karl Marks');
  });

  it('DELETE /api/users/:id -> remove user', async () => {
    const res = await fetch(`${baseUrl}/api/users/${createdUserId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status).toBe(204);
  });

  it('GET /api/users/:id -> after delete', async () => {
    const res = await fetch(`${baseUrl}/api/users/${createdUserId}`);
    expect(res.status).toBe(404);
  });
});
