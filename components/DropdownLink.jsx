import Link from 'next/link';
import React from 'react';

export default function DropdownLink(props) {
  // get href, children, ...rest  from props
  let { href, children, ...rest /* rest of properties */ } = props;

  return (
    <Link href={href}>
      <a {...rest}>{children}</a>
    </Link>
  );
}
