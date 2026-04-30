import { getPayload } from 'payload'

import config from '../../payload.config'
import { AUDITION_DEFAULTS, type AuditionData } from './audition-defaults'
import { mapAuditionData } from './audition-mapper'

export async function getAuditionData(): Promise<AuditionData> {
  try {
    const payload = await getPayload({ config })
    const raw = await payload.findGlobal({ slug: 'audition', depth: 2 })
    return mapAuditionData(raw)
  } catch {
    return AUDITION_DEFAULTS
  }
}
