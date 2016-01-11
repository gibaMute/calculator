/* eslint-disable no-unused-expressions */
import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { bindActionCreators } from 'redux'
import { Index } from 'containers/Index'
import baseThemeVariables from 'themes/_base/variables'
import Calculate from 'components/Calculate'
import CalculationsList from 'components/CalculationsList'
import Flex from 'containers/Flex'

function shallowRender(component) {
  const renderer = TestUtils.createRenderer()
  renderer.render(component)
  return renderer.getRenderOutput()
}

function renderWithProps(props = {}) {
  return TestUtils.renderIntoDocument(<Index {...props} />)
}

function shallowRenderWithProps(props = {}) {
  return shallowRender(<Index {...props} />)
}

describe('(Container) Index', function () {
  const calculation = () => {
    return {
      input: '1+1',
      output: 2,
      isError: false
    }
  }
  let component
  let props
  let rendered
  let spies

  beforeEach(() => {
    const currentCalculation = calculation()
    const previousCalculations = [calculation(), calculation()]
    spies = {}
    props = {
      currentCalculation,
      previousCalculations,
      theme: baseThemeVariables,
      ...bindActionCreators({
        keyPressed: (spies.keyPressed = sinon.spy()),
        updateCalculation: (spies.updateCalculation = sinon.spy())
      }, spies.dispatch = sinon.spy())
    }
    component = shallowRenderWithProps(props)
    rendered = renderWithProps(props)
  })

  it('Should render as a <Flex>.', function () {
    expect(component.type).to.equal(Flex)
  })

  it('Should render an instance of Calculations.', function () {
    const calculationsList = TestUtils.findRenderedComponentWithType(
      rendered,
      CalculationsList
    )

    expect(calculationsList).to.exist
  })

  it('Should render an instance of Calculate.', function () {
    const calculationInput = TestUtils.findRenderedComponentWithType(
      rendered,
      Calculate
    )

    expect(calculationInput).to.exist
  })

  describe('Calculator input', function () {
    let inputComponent

    beforeEach(() => {
      inputComponent = TestUtils.findRenderedDOMComponentWithClass(
        renderWithProps({ ...props }), 'calculator-input'
      )
    })

    it('should be rendered', function () {
      expect(inputComponent).to.exist
    })

    it('should dispatch "keyPressed" action on keyPress', function () {
      spies.keyPressed.should.have.not.been.called
      TestUtils.Simulate.keyPress(
        inputComponent,
        { key: 'r', keyCode: 82, which: 82 }
      )
      spies.keyPressed.should.have.been.called
    })

    it('should prevent paste in calculate input', function () {
      const spy = sinon.spy()
      TestUtils.Simulate.paste(inputComponent, { preventDefault: spy })
      spy.should.have.been.called
    })
  })
})
