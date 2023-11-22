class InvalidPlayerError extends Error {
  constructor () {
    super()
    this.name = 'InvalidPlayerError'
    this.message = 'Invalid Player'
  }
}

type PlayerAttribute = {
  attack: number
  defense: number
  speed: number
  intelligence: number
}

class Player {
  calculatePower ({ attack, defense, speed, intelligence }: PlayerAttribute): number {
    return attack * 2 + defense + speed + intelligence * 2
  }
}

class CalculatePower {
  loadPlayerDataRepo: LoadPlayerDataRepo

  constructor (loadPlayerDataRepo: LoadPlayerDataRepo) {
    this.loadPlayerDataRepo = loadPlayerDataRepo
  }

  async perform (id: string): Promise<number> {
    const data = await this.loadPlayerDataRepo.loadData(id)
    if (data === undefined) throw new InvalidPlayerError()
    return new Player().calculatePower(data)
  }
}

interface LoadPlayerDataRepo {
  loadData: (id: string) => Promise<PlayerAttribute | undefined>
}

class LoadPlayerDataRepoSpy implements LoadPlayerDataRepo {
  id?: string
  callsCount: number = 0
  result?: PlayerAttribute

  async loadData (id: string): Promise<PlayerAttribute | undefined> {
    this.id = id
    this.callsCount++
    return this.result
  }
}

type SutOutput = {
  sut: CalculatePower
  loadPlayerDataRepo: LoadPlayerDataRepoSpy
}

const makeSut = (): SutOutput => {
  const loadPlayerDataRepo = new LoadPlayerDataRepoSpy()
  loadPlayerDataRepo.result = {
    attack: 0,
    defense: 0,
    speed: 0,
    intelligence: 0
  }

  const sut = new CalculatePower(loadPlayerDataRepo)

  return {
    sut,
    loadPlayerDataRepo
  }
}

describe('CalculatePower Use Case', () => {
  it('should call LoadPlayerDataRepo correctly', async () => {
    const { sut, loadPlayerDataRepo } = makeSut()

    await sut.perform('any_id')

    expect(loadPlayerDataRepo.id).toBe('any_id')
    expect(loadPlayerDataRepo.callsCount).toBe(1)
  })

  it('should return correct power', async () => {
    const { sut, loadPlayerDataRepo } = makeSut()
    loadPlayerDataRepo.result = {
      attack: 20,
      defense: 10,
      speed: 10,
      intelligence: 50
    }
    const expectedPower = 40 + 10 + 10 + 100

    const power = await sut.perform('any_id')

    expect(power).toBe(expectedPower)
  })

  it('should throw InvalidPlayerError', async () => {
    const { sut, loadPlayerDataRepo } = makeSut()
    loadPlayerDataRepo.result = undefined

    const power = sut.perform('any_id')

    await expect(power).rejects.toThrow(new InvalidPlayerError())
  })
})
