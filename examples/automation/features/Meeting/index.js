import flow from '../../';
import NavigateTo from '../../';
import Login from '../../';
import CommonFlow from '../../';
import LoginSaleforce from '../../';
import { set, tag } from '../../';
import brand from '../../';

const options = {};

@flow({
  steps: [
    [Login, 'options'],
    [NavigateTo, 'meeting'],
  ],
})
class Meeting extends CommonFlow {
    @test('sf', 'google')
    @brand('rc', 'bt')
    @set([{
      startTime: ''
    }])
    async createMeeting(options) {
      //
      //
    }

    async checkForms() {

    }

    async main() {
      await this.createMeeting();
    }
}

@flow({
  steps: (steps) => ([
    LoginSaleforce,
    ...steps
  ]),
})
class SalesforceMeeting extends Meeting {
  @tag('sf')
  @set([{
    startTime: ''
  }])
  async createMeeting(options) {
    await super.createMeeting(options);
    // await checkCopyBorad(options);
  }
}

`npx marten test --tag sf --brand rc`