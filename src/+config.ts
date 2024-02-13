//*/
import { someExportName, exp2 } from './onRenderHtml' with { type: "fake" };
/*/
import { someExportName, exp2 } from './onRenderHtml' with { type: "real" };
//*/

export default {
  someExportName,
  exp2,
  passToClient: ['bla']
}
