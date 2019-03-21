import Vuex from 'vuex'
import VueRouter from 'vue-router'
import merge from 'lodash/merge'
import BroadcastChannel from 'broadcast-channel'
import flushPromises from 'flush-promises'
import { shallowMount, createLocalVue } from '@vue/test-utils'

import { createTestStore } from '../../../test-create'
import router from '../../router'
import HomePage from '../home-page'

function createWrapper(overrides) {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(VueRouter)

  const defaults = {
    localVue,
    router,
    store: createTestStore()
  }

  return shallowMount(HomePage, merge(defaults, overrides))
}

function destroyWrapper (wrapper, doneCallback, timeout) {
  wrapper.destroy()
  let time = timeout || 300
  return new Promise((resolve) => {
    setTimeout(() => {
      doneCallback()
      resolve()
    }, time)
  })
}

function onmessageFunc(message) {
  console.log(message)
}

describe('home-page.vue', () => {
  let wrapper
  let wrapper2
  
  let authChannelOnMessageSpy
  let authChannelPostMessageSpy
  let authChannelCloseSpy
  let authChannel2CloseSpy

  let setUserActionSpy
  let userMutationSpy
  
  const userName = 'test user name'
  const expectedUser = {
    name: userName
  }

  beforeAll(async () => {
    jest.setTimeout(9999999)
    await BroadcastChannel.clearNodeFolder()
  })
  afterAll(async (done) => {
    jest.restoreAllMocks()
    await destroyWrapper(wrapper, done, 500)
    await destroyWrapper(wrapper2, done, 500)
  })

  test('home-page matches snapshot test.', async () => {
    wrapper = await createWrapper()
    wrapper2 = await createWrapper()
    expect(wrapper).toMatchSnapshot()

    await wrapper.vm.$nextTick()
    await wrapper2.vm.$nextTick()

    expect(wrapper.vm.authChannel).toBeDefined()
    expect(wrapper2.vm.authChannel).toBeDefined()

    expect(wrapper.vm.user).toBeNull()
    expect(wrapper2.vm.user).toBeNull()
    setUserActionSpy = jest.spyOn(wrapper.vm.$store._actions.setUser, [0])
    userMutationSpy = jest.spyOn(wrapper.vm.$store._mutations.user, [0])
    
    authChannelOnMessageSpy = jest.spyOn(wrapper2.vm.authChannel._addEL.message[0], 'fn') // <-- works
    // authChannelOnMessageSpy = jest.spyOn(wrapper2.vm, 'authChannelMessageHandler') // <-- does not work, probably related to the onmessage invocation never leaving the vm so its not recordable from this level 
    authChannelPostMessageSpy = jest.spyOn(wrapper.vm.authChannel, 'postMessage')
    authChannelCloseSpy = jest.spyOn(wrapper.vm.authChannel, 'close')
    authChannel2CloseSpy = jest.spyOn(wrapper2.vm.authChannel, 'close')
  })

  test('find input, trigger name change', async (done) => {
    
    const nameInput = wrapper.find('input')
    nameInput.element.value = userName
    nameInput.trigger('change')
    
    await new Promise((resolve) => {
      setTimeout(resolve, 1000) // give node time to handle the message event
    }).then(() => {
      expect(wrapper2.vm.user).toBeNull()

      expect(setUserActionSpy).toHaveBeenCalledTimes(1)
      expect(setUserActionSpy).toHaveBeenCalledWith(expectedUser)
  
      expect(userMutationSpy).toHaveBeenCalledTimes(1)
      expect(userMutationSpy).toHaveBeenCalledWith({ user: expectedUser })
  
      expect(authChannelPostMessageSpy).toHaveBeenCalledTimes(1)
      expect(authChannelPostMessageSpy).toHaveBeenCalledWith(expectedUser)
  
      expect(authChannelOnMessageSpy).toHaveBeenCalledTimes(1)
      expect(authChannelOnMessageSpy).toHaveBeenCalledWith(expectedUser)
      done()
    })
  })

  test('destroy wrapper, assert BroadcastChannel#close is executed', async () => {
    wrapper.destroy()
    wrapper2.destroy()
    
    await wrapper.vm.$nextTick()

    expect(authChannelCloseSpy).toHaveBeenCalled()
    expect(authChannel2CloseSpy).toHaveBeenCalled()
  })
})
