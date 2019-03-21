import merge from 'lodash/merge'
import { createStore as createStoreImportInTest } from './ClientApp/store/index'

export function createTestStore(overrides) {
  let http = {
    put: jest.fn(() => {
      Promise.resolve()
    }),
    post: jest.fn(() => {
      Promise.resolve()
    }),
    get: jest.fn(() => {
      Promise.resolve()
    }),
    delete: jest.fn(() => {
      Promise.resolve()
    })
  }

  let store = { plugins: [] }

  if (overrides && typeof overrides.http !== 'undefined' && typeof overrides.http === 'object') {
    merge(http, overrides.http)
  }
  if (overrides && typeof overrides.store !== 'undefined' && typeof overrides.store === 'object') {
    merge(store, overrides.store)
  }

  return createStoreImportInTest(http, store)
}
