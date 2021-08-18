
    window.reactComponents = {};

    window.vueComponents = {};

  
      import React from "react";

      import ReactDOM from "react-dom";


      import ReactWrapper from '../node_modules/better-docs/lib/react-wrapper.js';

      window.React = React;

      window.ReactDOM = ReactDOM;

      window.ReactWrapper = ReactWrapper;

    
    import './styles/reset.css';

    import './styles/iframe.css';

  
      import _CustomWrapper from '../src/docWrapper.js';

      window._CustomWrapper = _CustomWrapper;

      import Component0 from '../src/components/AmountSelectSlider.js';
reactComponents['AmountSelectSlider'] = Component0;

import Component1 from '../src/components/HelpPopover.js';
reactComponents['HelpPopover'] = Component1;

import Component2 from '../src/components/Hero.js';
reactComponents['Hero'] = Component2;

import Component3 from '../src/components/LogoIcon.js';
reactComponents['LogoIcon'] = Component3;

import Component4 from '../src/components/SupportedDogeList.js';
reactComponents['SupportedDogeList'] = Component4;