import { mount } from '@vue/test-utils'
import DatetimePicker from '@/components/datetime-picker'
import { slowVerticalDrag } from '../utils'

const testTime = '12:00'
const testDate = new Date('2018/01/01 19:00')

describe('datetime-picker', () => {
  let wrapper

  afterEach(() => {
    wrapper && wrapper.destroy()
  })

  test('create datetime picker', () => {
    let date = new Date()

    wrapper = mount(DatetimePicker, {
      attachToDocument: true,
      propsData: {
        type: 'datetime',
        value: date
      }
    })

    expect(wrapper.name()).toBe('wv-datetime-picker')
    expect(wrapper.findAll('.weui-picker__group').length).toBe(5)
  })

  test('create date picker', () => {
    wrapper = mount(DatetimePicker, {
      attachToDocument: true,
      propsData: {
        type: 'date'
      }
    })

    expect(wrapper.name()).toBe('wv-datetime-picker')
    expect(wrapper.findAll('.weui-picker__group').length).toBe(3)
  })

  test('create time picker', () => {
    wrapper = mount(DatetimePicker, {
      attachToDocument: true,
      propsData: {
        type: 'time'
      }
    })

    expect(wrapper.name()).toBe('wv-datetime-picker')
    expect(wrapper.findAll('.weui-picker__group').length).toBe(2)
  })

  test('test open and close method', () => {
    wrapper = mount(DatetimePicker, {
      propsData: {}
    })

    wrapper.vm.$nextTick(() => {
      wrapper.vm.open()
      expect(wrapper.vm.currentVisible).toBe(true)

      wrapper.vm.close()
      expect(wrapper.vm.currentVisible).toBe(false)
    })
  })

  test('test isLeapyear method', () => {
    wrapper = mount(DatetimePicker, {
      propsData: {}
    })

    expect(wrapper.vm.isLeapYear(2012)).toBe(true)
    expect(wrapper.vm.isLeapYear(2000)).toBe(true)
    expect(wrapper.vm.isLeapYear(2001)).toBe(false)
  })

  test('test isShortMonth method', () => {
    wrapper = mount(DatetimePicker, {
      propsData: {}
    })

    expect(wrapper.vm.isShortMonth(4)).toBe(true)
    expect(wrapper.vm.isShortMonth(1)).toBe(false)
  })

  test('test getMonthEndDay method', () => {
    wrapper = mount(DatetimePicker, {
      propsData: {}
    })

    expect(wrapper.vm.getMonthEndDay(2018, 1)).toBe(31)
    expect(wrapper.vm.getMonthEndDay(2016, 1)).toBe(31)
    expect(wrapper.vm.getMonthEndDay(2016, 4)).toBe(30)

    expect(wrapper.vm.getMonthEndDay(2016, 2)).toBe(29)
    expect(wrapper.vm.getMonthEndDay(2018, 2)).toBe(28)
  })

  test('test getTrueValue method', () => {
    wrapper = mount(DatetimePicker, {
      propsData: {}
    })

    expect(wrapper.vm.getTrueValue()).toBe(undefined)
    expect(wrapper.vm.getTrueValue('1')).toBe(1)
    expect(wrapper.vm.getTrueValue('01')).toBe(1)
    expect(wrapper.vm.getTrueValue('2月')).toBe(2)
    expect(wrapper.vm.getTrueValue('2018年')).toBe(2018)
    expect(wrapper.vm.getTrueValue('A2018年')).toBe(2018)
  })

  test('onConfirm', done => {
    wrapper = mount(DatetimePicker, {
      propsData: {}
    })

    wrapper.vm.$nextTick(() => {
      wrapper
        .findAll('.weui-picker__action')
        .at(1)
        .trigger('click')

      expect(wrapper.vm.visible).toBe(false)
      expect(wrapper.emitted().confirm).toBeTruthy()
      done()
    })
  })

  test('onCancel', done => {
    wrapper = mount(DatetimePicker, {
      propsData: {}
    })

    wrapper.vm.$nextTick(() => {
      wrapper
        .findAll('.weui-picker__action')
        .at(0)
        .trigger('click')

      expect(wrapper.vm.visible).toBe(false)
      expect(wrapper.emitted().cancel).toBeTruthy()
      done()
    })
  })

  test('drag time picker', (done) => {
    wrapper = mount(DatetimePicker, {
      attachToDocument: true,
      propsData: {
        visible: true,
        type: 'time',
        value: testTime
      }
    })

    wrapper.vm.$nextTick(() => {
      console.log('time')
      const [hourColumn, minuteColumn] = wrapper.findAll('.weui-picker__group').wrappers

      // TODO:
      // slowVerticalDrag(hourColumn, 0, -34)
      // expect(wrapper.vm.currentValue).toEqual('13:00')

      // slowVerticalDrag(minuteColumn, 0, -34)
      // expect(wrapper.vm.currentValue).toEqual('13:01')

      // slowVerticalDrag(hourColumn, 0, -34 * 5)
      // expect(wrapper.vm.currentValue).toEqual('18:01')
      //
      // // hour will be 23
      // slowVerticalDrag(hourColumn, 0, -34 * 10)
      // expect(wrapper.vm.currentValue).toEqual('23:01')
      //
      // // hour will be 0
      // slowVerticalDrag(hourColumn, 0, 34 * 24)
      // slowVerticalDrag(minuteColumn, 0, 34 * 10)
      // expect(wrapper.vm.currentValue).toEqual('0:00')

      done()
    })
  })

  test('drag datetime picker', (done) => {
    wrapper = mount(DatetimePicker, {
      attachToDocument: true,
      propsData: {
        type: 'datetime',
        value: testDate
      }
    })

    expect(wrapper.vm.currentValue).toEqual(testDate)

    wrapper.vm.$nextTick(() => {
      console.log('datetime')

      const [yearColumn, monthColumn, dateColumn, hourColumn, minuteColumn] = wrapper.findAll('.weui-picker__group').wrappers

      slowVerticalDrag(yearColumn, 0, -34)
      slowVerticalDrag(monthColumn, 0, -34)
      slowVerticalDrag(dateColumn, 0, -34)
      slowVerticalDrag(hourColumn, 0, -34)
      slowVerticalDrag(minuteColumn, 0, -34)

      expect(wrapper.vm.currentValue.getFullYear()).toBe(testDate.getFullYear() + 1)
      expect(wrapper.vm.currentValue.getMonth()).toBe(testDate.getMonth() + 1)
      expect(wrapper.vm.currentValue.getDate()).toBe(testDate.getDate() + 1)
      expect(wrapper.vm.currentValue.getHours()).toBe(testDate.getHours() + 1)
      expect(wrapper.vm.currentValue.getMinutes()).toBe(testDate.getMinutes() + 1)

      done()
    })
  })

  test('drag date picker', (done) => {
    wrapper = mount(DatetimePicker, {
      attachToDocument: true,
      propsData: {
        type: 'date',
        value: testDate
      }
    })

    expect(wrapper.vm.currentValue).toEqual(testDate)

    wrapper.vm.$nextTick(() => {
      console.log('date')
      const [yearColumn, monthColumn, dateColumn] = wrapper.findAll('.weui-picker__group').wrappers

      slowVerticalDrag(yearColumn, 0, -34)
      slowVerticalDrag(monthColumn, 0, -34)
      slowVerticalDrag(dateColumn, 0, -34)

      expect(wrapper.vm.currentValue.getFullYear()).toEqual(testDate.getFullYear() + 1)
      expect(wrapper.vm.currentValue.getMonth()).toEqual(testDate.getMonth() + 1)
      expect(wrapper.vm.currentValue.getDate()).toEqual(testDate.getDate() + 1)

      done()
    })
  })

  test('watch value change', () => {
    wrapper = mount(DatetimePicker, {
      propsData: {
        type: 'date',
        value: testDate
      }
    })

    const newValue = new Date()

    wrapper.setProps({
      value: newValue
    })

    expect(wrapper.vm.currentValue).toEqual(newValue)
  })
})
