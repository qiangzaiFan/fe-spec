import ora from 'ora'
import initAction from './actions/init';
import scanAction from './actions/scan';
import { PKG_NAME } from './utils/constants';
import printReport from './utils/print-report'
import type { InitOptions, ScanOptions} from './types';

type IInitOptions = Omit<InitOptions,'checkVersionUpdate'>

export const init = async (options: InitOptions) => {
  return await initAction({
    ...options,
  });
};

export const scan = async (options: ScanOptions) => {
 const checking = ora()
 checking.start(`执行${PKG_NAME} 代码检查`)

 const report = await scanAction(options)
 const {result,errorCount,warningCount} = report;
 let type = 'succeed'
 if(errorCount > 0){
  type = 'fail'
 }else if (warningCount > 0){
  type = 'warn'
 }

 checking[type]()
 if(result.length>0) printReport(result,false)

  return report
};
