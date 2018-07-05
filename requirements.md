## Requirements

#### Expected Features - Solution Goal

* High-quality reusable code by steps.
* Maintainable decoupled process steps.
* Process steps runner with multiple granularity control.

#### Steps
* composable
>Separate combination of steps.
* inheritable & extensible
>Support for object-oriented programming. 

#### Steps Runner
* customizable
>At run time, the arguments of any step are passed, the steps execution sequence can be customized, and the combination of any child steps is made.
* controllable
>The execution granularity and position of the free control steps.
* Context by arguments
>Merge the results of all step execution through context passing.

#### Expected APIs
- [class: Sequence](#class-sequence)
- [class: Steps](#class-steps)
  * [steps.reset()](#stepsreset)
  * [steps.exec(sequence)](#stepsexecsequence)
  * [steps.execUntil(step)](#stepsexecuntilstep)
  * [steps.execBefore(step)](#stepsexecbeforestep)
  * [steps.skipUntil(step)](#stepsskipuntilstep)
  * [steps.skipBefore(step)](#stepsskipbeforestep)


#### class: Sequence
By sequence class, it can be redefined the combined sequence of child step between different steps.
#### class: Steps
Steps Runner can control the operation of the current sub Steps and adjust the original step sequence.
##### steps.reset()
##### steps.exec(sequence)
##### steps.execUntil(step)
##### steps.execBefore(step)
##### steps.skipUntil(step)
##### steps.skipBefore(step)

#### Expected Boilerplate

Examples: 

```javascript

```