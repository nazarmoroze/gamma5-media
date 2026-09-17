import {caseType} from './documents/case'
import {quoteRequestType} from './documents/quoteRequest'
import {homePageType} from './singletons/homePage'
import {privacyPolicyType} from './singletons/privacyPolicy'
import {siteSettingsType} from './singletons/siteSettings'

export const schemaTypes = [homePageType, siteSettingsType, caseType, quoteRequestType, privacyPolicyType]
