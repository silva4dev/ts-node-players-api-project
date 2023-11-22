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

  async loadData (id: string): Promise<void> {
    this.id = id
  }
}

describe('CalculatePower Use Case', () => {
  it('should call LoadPlayerDataRepo correctly', async () => {
    const loadPlayerDataRepo = new LoadPlayerDataRepoSpy()
    const calculatePower = new CalculatePower(loadPlayerDataRepo)

    await calculatePower.calculate('any_id')

    expect(loadPlayerDataRepo.id).toBe('any_id')
  })
})
