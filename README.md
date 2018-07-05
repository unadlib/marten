# marten
A flow controller library.

>`Steps` support composable, inheritable & extensible, freestyle steps runner.

## APIs
- [pointer: Steps](#runner-steps)
  * [steps.move(step)](#steps-move)
  * [steps.skip(step)](#steps-skip)
  * [steps.reset()](#steps-reset)
- [runner: Steps](#runner-steps)
  * [steps.until(step)](#steps-until)
  * [steps.exec()](#steps-exec)
  * [steps.before(step)](#steps-before)

#### steps.move(step)
- `step` <[string]>

Move the controller pointer to a step.

#### steps.skip(step)
- `step` <[string]>

Set Skip a step.

#### steps.reset()

Reset all steps ignore and initialize pointer position.

#### steps.until(step)
- `step` <[string]>

Run steps until a step position.

#### steps.exec(step)
- `step` <[string]>

Run steps by set sequence.

#### steps.before(step)
- `step` <[string]>

Run steps before a step position.
