import React from "react";
import { PageProps } from "gatsby";

type BasePageFC<DataType = object, PageContextType = object> = React.FC<
  PageProps<DataType, PageContextType>
>;
export default BasePageFC;
