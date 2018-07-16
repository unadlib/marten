# marten
A Flow Controller Library.

#### Solution Goal

* High-quality reusable code by steps.
* Maintainable decoupled process steps.
* Process steps runner with multiple granularity control.

#### Features
* Composable
>Separate combination of steps.
* Inheritable & extensible
>Support for object-oriented programming. 
* Customizable
>At run time, the arguments of any step are passed, the steps execution sequence can be customized, and the combination of any child steps is made.
* Controllable
>The execution granularity and position of the free control steps.
* Context by arguments
>Merge the results of all step execution through context passing.

## APIs
- [function: createFlow](#function-createflow)
- [class: Steps](#class-steps)
  * [steps.reset()](#stepsreset)
  * [steps.skip([step])](#stepsskipstep)
  * [steps.exec()[return Promise]](#stepsexec)
  * [steps.execTo(step)[return Promise]](#stepsexectostep)
  * [steps.execBefore(step)[return Promise]](#stepsexecbeforestep)

#### function: createFlow
By sequence, it can be redefined the combined sequence steps for steps runner.

```javascript
(async (context) => {
  const flow = createFlow(
      Login,
      Navigation,
      Setting,
      MakeCalls,
    )
    const process = flow(context);
    await process.execTo(Navigation);
    await process.execBefore(Setting.callingSetting);
    await process.exec();
})();
```

#### class: Steps
Steps Runner can be controlled the operation of the current sub steps by free.

##### steps.reset()

Reset all steps ignore in the flow and initialize flow.

##### steps.skip([step])
- `step` <function>

Set skip some steps in the flow.

##### steps.exec()
- **return** <Promise>

Execute the flow by set sequence and skip setting.

##### steps.execTo(step)
- `step` <function|class>
- **return** <Promise>

Run steps until a step position.

##### steps.execBefore(step)
- `step` <[function|class]>
- **return** <Promise>

Run steps before a step position.
