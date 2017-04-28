import React from 'react';
import { expect } from 'chai';
import TestUtils from 'react-dom/test-utils';

const {
  scryRenderedDOMComponentsWithTag,
  Simulate,
  renderIntoDocument
} = TestUtils;

import TextInput from '../../src/components/TextInput';


describe('TextInput', () => {
  let component;

  // booleans for callbacks
  let canceled;
  let saved;

  // callbacks for testing locally
  const cancel = () => { canceled = true };
  const done = () => { saved = true };


  beforeEach(() => {
    canceled = false;
    saved = false;

    component = renderIntoDocument(
      <TextInput fieldType={'text'}
                 text={'text'}
                 selfId={0}
                 recipeId={0}
                 cancelEditingSelf={cancel}
                 doneEditingSelf={done} />
    );
  });


  it('clears state.value on componentWillMount', () => {
    expect(component.state.value).to.equal(component.props.text);
    
    component.componentWillMount();
    expect(component.state.value).to.equal('');
  });

  it('sets state.value to props.text on componentDidMount', () => {
    component.setState({value: ''});
    expect(component.state.value).to.equal('');

    component.componentDidMount();
    expect(component.state.value).to.equal(component.props.text);
  });

  it('auto-focuses on render', () => {
    const input = scryRenderedDOMComponentsWithTag(component, 'input')[0];

    expect(document.activeElement).to.equal(input);
  });

  it('invokes an onChange callback setting component value to input value', () => {
    const input = scryRenderedDOMComponentsWithTag(component, 'input')[0];

    expect(input.value).to.equal(component.state.value);

    input.value = 'new text';
    expect(input.value).to.not.equal(component.state.value);

    Simulate.change(input);
    expect(input.value).to.equal(component.state.value);
  });

  it('invokes a callback when component is blurred', () => {
    const input = scryRenderedDOMComponentsWithTag(component, 'input')[0];

    Simulate.blur(input);
    expect(canceled).to.equal(true);
  });

  it('invokes a callback on pressing "Escape"', () => {
    const input = scryRenderedDOMComponentsWithTag(component, 'input')[0];

    Simulate.keyDown(input, { key: 'Escape' });
    expect(canceled).to.equal(true);
  });

  describe('on pressing enter', () => {
    it('invokes a callback when state.value === props.text', () => {
      const input = scryRenderedDOMComponentsWithTag(component, 'input')[0];

      expect(component.state.value).to.equal(component.props.text);

      Simulate.keyDown(input, { key: 'Enter' });
      expect(canceled).to.equal(true);
      expect(saved).to.equal(false);
    });

    it('invokes a different callback when state.value !== props.text', () => {
      const input = scryRenderedDOMComponentsWithTag(component, 'input')[0];

      component.setState({ value: 'new text' });
      expect(component.state.value).to.not.equal(component.props.text);

      Simulate.keyDown(input, { key: 'Enter' });
      expect(canceled).to.equal(false);
      expect(saved).to.equal(true);
    });
  });

  it('renders the correct input type based on fieldType prop', () => {
    // as fieldType={'text'}
    let input = scryRenderedDOMComponentsWithTag(component, 'input')[0];

    expect(input.tagName).to.equal('INPUT');
    expect(input.type).to.equal('text');

    // as fieldType={'textArea'}
    component = renderIntoDocument(
      <TextInput fieldType={'textarea'}
                 text={'text'}
                 selfId={0}
                 recipeId={0}
                 cancelEditingSelf={cancel}
                 doneEditingSelf={done} />
    )

    input = scryRenderedDOMComponentsWithTag(component, 'textarea')[0];

    expect(input.tagName).to.equal('TEXTAREA');
  })
});
