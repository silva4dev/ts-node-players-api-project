class CalculatePower {
  loadPlayerDataRepo: LoadPlayerDataRepo

  constructor (loadPlayerDataRepo: LoadPlayerDataRepo) {
    this.loadPlayerDataRepo = loadPlayerDataRepo
  }

  async calculate (id: string): Promise<void> {
    await this.loadPlayerDataRepo.loadData(id)
  }
}

interface LoadPlayerDataRepo {
  loadData: (id: string) => Promise<void>
}

class LoadPlayerDataRepoSpy implements LoadPlayerDataRepo {
  id?: string
  callsCount: number = 0

  async loadData (id: string): Promise<void> {
    this.id = id
    this.callsCount++
  }
}

describe('CalculatePower Use Case', () => {
  it('should call LoadPlayerDataRepo correctly', async () => {
    const loadPlayerDataRepo = new LoadPlayerDataRepoSpy()
    const sut = new CalculatePower(loadPlayerDataRepo)

    await sut.calculate('any_id')

    expect(loadPlayerDataRepo.id).toBe('any_id')
    expect(loadPlayerDataRepo.callsCount).toBe(1)
  })
})
