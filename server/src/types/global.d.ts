declare global {
  interface flight {
    flightNumber?: number
    rocket?: string
    mission?: string
  }

  interface launch extends flight {
    launchDate: Date
    upcoming?: boolean
    success?: boolean
    target?: string
    customers?: string[]
  }
  interface planet {
    kepler_name: string
    koi_disposition: string
    koi_insol: number
    koi_insol: number
    koi_prad: number
  }
  interface query {
    skip: number
    limit: number
  }
  interface params {
    page: number
    limit: number
  }
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number
      MONGO_URL: string
      // add more environment variables and their types here
    }
  }
}

export {}
