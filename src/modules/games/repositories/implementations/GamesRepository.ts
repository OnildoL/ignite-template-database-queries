import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = this.repository
    .createQueryBuilder("games")
    .where('games.title ILIKE :title', { title: `%${param}%` })
    .getMany()

    return games
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const total = await this.repository.query('SELECT COUNT(title) FROM games'); // Complete usando raw query
    return total
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const games = await this.repository
      .createQueryBuilder()
      .relation(Game, 'users')
      .of(id)
      .loadMany()

    return games
  }
}
