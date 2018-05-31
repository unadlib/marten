import Process from '../../basic/commons/index';
import Navigate from '../../basic/steps/Navigate';
import Login from '../../basic/steps/Login';
// import Common from '../../';
// import LoginSaleforce from '../../';
// import { set, tag } from '../../';
// import brand from '../../';

// const options = {};

// @flow({
//   steps: [
//     [Login, 'options'],
//     [NavigateTo, 'meeting'],
//   ],
// })
// class Meeting extends Common {
//     async createMeeting() {

//     }

//     @test('sf', 'google')
//     @brand('rc', 'bt')
//     @set([{
//       startTime: ''
//     }])
//     async checkMeeting(options) {

//     }
// }

// @flow({
//   steps: (steps) => ([
//     LoginSaleforce,
//     ...steps
//   ]),
// })
// class SalesforceMeeting extends Meeting {

//   async createMeeting(options) {
//     await super.createMeeting(options);
//     // await checkCopyBorad(options);
//   }

//   @tag('sf')
//   @set([{
//     startTime: ''
//   }])
//   async checkMeeting(options) {
//     //
//     //
//   }
// }

// `npx marten test --tag sf --brand rc`

@Process.stage({
  steps: [{
    module: Login,
  }, {
    module: Navigate,
  }],
})
class Meeting extends Process {
  async create() {

  }

  async input(options) {

  }
}

export {
  Meeting as
  default,
}