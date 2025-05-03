import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { User } from '@/modules/users/entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    async create(createData: CreateUserDto): Promise<User> {
        const user = new User();

        user.email = createData.email;
        user.firstName = createData.firstName;
        user.lastName = createData.lastName;

        user.passwordHash = await bcrypt.hash(createData.password, 10);

        return this.usersRepository.save(user);
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ id });
    }

    findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ email });
    }

    async update(id: string, updateData: UpdateUserDto): Promise<User | null> {
        const { password, ...updates } = updateData;

        if (password) {
            (updates as Partial<User>).passwordHash = await bcrypt.hash(
                password,
                10
            );
        }

        await this.usersRepository.update(id, updates);

        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }

    async validatePassword(user: User, password: string): Promise<boolean> {
        return bcrypt.compare(password, user.passwordHash);
    }
}
