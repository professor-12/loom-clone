"use client"
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Dot = () => {
      return (
            <DotLottieReact
                  src="/2.lottie"
                  loop
                  autoplay
                  width={20}
                  height={20}
                  className='w-44 h-44 bg-white'
            />
      );
};


export default Dot