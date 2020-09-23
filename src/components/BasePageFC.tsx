import React from "react";
import { PageProps } from "gatsby";

type BasePageFC<DataType = object, PageContextType = object> = React.FC<
  PageProps<DataType, PageContextType> & { transitionStatus: string }
>;
export default BasePageFC;
