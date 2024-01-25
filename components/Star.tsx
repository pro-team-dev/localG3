import * as React from "react";
import Svg, { Path, Mask, G, SvgXml } from "react-native-svg";

type StarType = {
  width?: number;
  height?: number;
  color?: string;
  percentage?: number;
};
function percentageToValue(percentage, min, max) {
  if (percentage < 0 || percentage > 100) {
    console.error("Percentage should be between 0 and 100.");
    return null;
  }

  const range = max - min;
  const value = (percentage / 100) * range + min;

  return value;
}

function Star(props: StarType) {
  const { width, height, color, percentage } = props;
  let dx = 0;
  if (percentage != undefined) {
    dx = percentageToValue(percentage, 0, 262) - 356;
  }
  let x = dx.toString();
  return (
    <SvgXml
      xml={`
    <svg xmlns="http://www.w3.org/2000/svg" width="${
      width ? width : 30
    }" height="${height ? height : 30}" viewBox="0 0 262 262" fill="none">
<path d="M126.296 13.0435C127.885 8.63833 134.115 8.63834 135.704 13.0435L161.419 84.3547C162.114 86.2823 163.914 87.5906 165.962 87.6561L241.73 90.0761C246.41 90.2256 248.335 96.1507 244.637 99.0228L184.762 145.516C183.144 146.772 182.456 148.889 183.027 150.857L204.138 223.664C205.442 228.162 200.402 231.824 196.528 229.193L133.808 186.616C132.113 185.466 129.887 185.466 128.192 186.616L65.4722 229.193C61.5977 231.824 56.5575 228.162 57.8617 223.664L78.9735 150.857C79.5441 148.889 78.8563 146.772 77.2378 145.516L17.3633 99.0228C13.6645 96.1507 15.5897 90.2256 20.2702 90.0761L96.0375 87.6561C98.0856 87.5906 99.8864 86.2823 100.581 84.3547L126.296 13.0435Z" fill="rgb(220,220,220)"/>
<mask id="mask0_61_18" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="15" y="9" width="232" height="222">
<path d="M126.296 13.0435C127.885 8.63833 134.115 8.63834 135.704 13.0435L161.419 84.3547C162.114 86.2823 163.914 87.5906 165.962 87.6561L241.73 90.0761C246.41 90.2256 248.335 96.1507 244.637 99.0228L184.762 145.516C183.144 146.772 182.456 148.889 183.027 150.857L204.138 223.664C205.442 228.162 200.402 231.824 196.528 229.193L133.808 186.616C132.113 185.466 129.887 185.466 128.192 186.616L65.4722 229.193C61.5977 231.824 56.5575 228.162 57.8617 223.664L78.9735 150.857C79.5441 148.889 78.8563 146.772 77.2378 145.516L17.3633 99.0228C13.6645 96.1507 15.5897 90.2256 20.2702 90.0761L96.0375 87.6561C98.0856 87.5906 99.8864 86.2823 100.581 84.3547L126.296 13.0435Z" fill="rgb(220,220,220)"/>
</mask>
<g mask="url(#mask0_61_18)">
<rect x="${x ? x : -226}" y="-84" width="357" height="323" fill="gold"/>
</g>
</svg>
    `}
    />
  );
}

export default Star;
