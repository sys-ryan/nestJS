import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //Create a fake copy of thje users service
    const users: User[] = [];

    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    //Create the testing module
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    // Get an instance of the service
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    //redefine UsersService.find()

    await service.signup('asdf@asdf.com', 'asdf');
    await expect(
      service.signup('asdf@asdf.com', 'asdf'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdf@asdf.com', 'asdf'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('asdf@asdf.com', '1234');

    await expect(service.signin('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided v_1', async () => {
    // fakeUsersService.find = async () =>
    //   Promise.resolve([
    //     {
    //       email: 'asdf@adsf.com',
    //       password:
    //         '4b256a30a9ac0c2b.b15ee85329da6b5f01bd35f6aa7d314c36ef0fb35d4a3f9e26953207ed62a406',
    //     } as User,
    //   ]);
    // const user = await service.signin('asdf@asdf.com', 'mypassword');
    // expect(user).toBeDefined();

    //getting the salted password for 'mypassword'
    // const user = await service.signup('asdf@asdf.com', 'mypassword');
    // console.log(user);

    await service.signup('asdf@asdf.com', 'mypassword');

    const user = await service.signin('asdf@asdf.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
