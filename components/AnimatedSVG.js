import * as React from "react";
import { Defs, Path, Rect } from "react-native-svg";
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient'
let preloaderLines = [
    'M133.24,176.75l-16.72.11-20.16,79.4h14.73l3.21-15.06h21l3,15.39h14.4ZM131.68,230h-3.4l0-12.14h-1.89l0,12.12h-3.08V217.87h-1.88V230H118V213.2a5.78,5.78,0,0,1,4.49-4.24V190.59h5.1V209s3.9.62,4.09,4.17C131.77,215.58,131.68,230,131.68,230Z',
    'M55.27,257.21v-79.4H90.82V189.7H68.17v21.08h21v11h-21v23.44H91.94v12Z',
    'M181.43,187.48v68H168.2v-68H153.28V176h43.07v11.44Z',
    'M151,149.89a23.15,23.15,0,0,1-3.83,8.39,18.45,18.45,0,0,1-6.82,5.64A22.65,22.65,0,0,1,130.24,166a22.38,22.38,0,0,1-10.11-2.06,18.12,18.12,0,0,1-6.72-5.64,22.84,22.84,0,0,1-3.73-8.39,45.09,45.09,0,0,1-1.13-10.3V94.74h11.78v43.77a41.82,41.82,0,0,0,.44,6.23,16.94,16.94,0,0,0,1.57,5.25,9.15,9.15,0,0,0,3.09,3.58,10.08,10.08,0,0,0,10,0,9.23,9.23,0,0,0,3.09-3.58,17.49,17.49,0,0,0,1.57-5.25,43.2,43.2,0,0,0,.44-6.23V94.74h11.68v44.85A43.43,43.43,0,0,1,151,149.89Z',
    'M182.71,104.75v59.47H171.13V104.75h-13v-10h37.68v10Z',
    'M62.86,110.22,49,118.42s.17-23.93,23.43-24.93,24.6,32.3,24.43,36.15S97.5,163.27,73.07,166c0,0-25.27,2.68-25.27-34l-6.86-4.19,17.57-9.37,9.2,16.74-7.7-.84s.17,19.58,12.05,20.08,12.39-24.93,12.39-24.93S85,112.06,77.92,107,65.2,106.88,62.86,110.22Z',
    'M215.8,215.68L302.05,215.68 302.05,229.85 215.8,229.85z',
    'M302.4,205.82h-62A21.46,21.46,0,0,1,242.82,193a23.3,23.3,0,0,1,7.38-6.53c7.74-3.88,27.61-11.71,37.75-20.51s18.1-28.07,2.32-46.68-35.21-9.8-35.21-9.8-22.8,7.07-21.31,36.47l-11.14.17S220,111.3,250.9,100.67s48,11.13,48,11.13,27.58,30.73-3.82,60.3a116.53,116.53,0,0,1-31.4,20.43H302.4v-9.14L322,207.48l-19.27,27.41Z',
    'M233.15,206,218,205.83s-2-21.08,14.13-34C250,157.46,271,153.15,273,144.18c0,0,1.32-10-8.14-10.79s-12.63,6.47-12.46,12.29H238.12s-2.16-31.4,28.57-31.4c18.83,0,24.19,13.1,25.52,23.25a28.67,28.67,0,0,1-10.37,26c-4.35,3.51-10.61,6.91-19.3,9.21C231.53,181,233.69,201.48,233.15,206Z'
];


export default preloaderLines

/*
        <Path
            className="cls-1"
            d="M182.71,104.75v59.47H171.13V104.75h-13v-10h37.68v10Z"
            transform="translate(-40.94 -93.47)"
        />
        {/*O in out to eat
<Path
    className="cls-1"
    d="M62.86,110.22,49,118.42s.17-23.93,23.43-24.93,24.6,32.3,24.43,36.15S97.5,163.27,73.07,166c0,0-25.27,2.68-25.27-34l-6.86-4.19,17.57-9.37,9.2,16.74-7.7-.84s.17,19.58,12.05,20.08,12.39-24.93,12.39-24.93S85,112.06,77.92,107,65.2,106.88,62.86,110.22Z"
    transform="translate(-40.94 -93.47)"
/>
<Rect className="cls-1" x={176.8} y={152.05} width={91.25} height={14.17} />
<Rect className="cls-1" x={176.8} y={117.67} width={85.94} height={13.94} />
<Path
    className="cls-1"
    d="M302.4,205.82h-62A21.46,21.46,0,0,1,242.82,193a23.3,23.3,0,0,1,7.38-6.53c7.74-3.88,27.61-11.71,37.75-20.51s18.1-28.07,2.32-46.68-35.21-9.8-35.21-9.8-22.8,7.07-21.31,36.47l-11.14.17S220,111.3,250.9,100.67s48,11.13,48,11.13,27.58,30.73-3.82,60.3a116.53,116.53,0,0,1-31.4,20.43H302.4v-9.14L322,207.48l-19.27,27.41Z"
    transform="translate(-40.94 -93.47)"
/>
<Path
    className="cls-1"
    d="M233.15,206,218,205.83s-2-21.08,14.13-34C250,157.46,271,153.15,273,144.18c0,0,1.32-10-8.14-10.79s-12.63,6.47-12.46,12.29H238.12s-2.16-31.4,28.57-31.4c18.83,0,24.19,13.1,25.52,23.25a28.67,28.67,0,0,1-10.37,26c-4.35,3.51-10.61,6.91-19.3,9.21C231.53,181,233.69,201.48,233.15,206Z"
    transform="translate(-40.94 -93.47)"
/>*/

