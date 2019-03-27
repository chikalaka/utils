describe("renderByConditions", () => {
  const MockComponent = () => <div className="text">Mock text</div>

  const A = () => <div className="text">A text</div>

  const B = () => <div className="text">B text</div>

  test("only one condition, without component", () => {
    const Component = renderByConditions([props => props.a])(MockComponent)
    const mountedComponent = mount(<Component a={true} />)
    const textExists = !!mountedComponent.find(".text").length

    expect(textExists).toBe(false)
  })

  test("only one condition, with component", () => {
    const Component = renderByConditions([props => props.a, A])(MockComponent)
    const mountedComponent = mount(<Component a={true} />)
    const text = mountedComponent.find(".text").text()

    expect(text).toBe("A text")
  })

  test("multiple conditions, all with components", () => {
    const Component = renderByConditions(
      [props => !props.a, A],
      [props => props.b, B]
    )(MockComponent)
    const mountedComponent = mount(<Component a={true} b={true} />)
    const text = mountedComponent.find(".text").text()

    expect(text).toBe("B text")
  })

  test("multiple conditions, all false", () => {
    const Component = renderByConditions(
      [props => !props.a, A],
      [props => !props.b, B]
    )(MockComponent)
    const mountedComponent = mount(<Component a={true} b={true} />)
    const text = mountedComponent.find(".text").text()

    expect(text).toBe("Mock text")
  })

  test("multiple conditions, only some with components", () => {
    const Component = renderByConditions(
      [props => !props.a],
      [props => props.b, B]
    )(MockComponent)
    const mountedComponent = mount(<Component a={true} b={true} />)
    const text = mountedComponent.find(".text").text()

    expect(text).toBe("B text")
  })

  test("multiple conditions, all without components", () => {
    const Component = renderByConditions(
      [props => !props.a],
      [props => !props.b]
    )(MockComponent)
    const mountedComponent = mount(<Component a={true} b={true} />)
    const text = mountedComponent.find(".text").text()

    expect(text).toBe("Mock text")
  })

  test("conditions false, end with identity", () => {
    const Component = renderByConditions([props => !props.a], [identity, B])(
      MockComponent
    )
    const mountedComponent = mount(<Component a={true} b={true} />)
    const text = mountedComponent.find(".text").text()

    expect(text).toBe("B text")
  })
})