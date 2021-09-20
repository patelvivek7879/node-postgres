const doSomething = () =>{
    console.log('heellllllooo')
    console.log('test');
    console.log('heellllllooo')
    console.log('test');
    console.log('heellllllooo')
    console.log('test');
    console.log('heellllllooo')
    console.log('test');
}

const doingSomething = () =>{
    console.time('doSomething()');
    doSomething();
    console.timeEnd('doSomething()');
    console.time('doSomething()');
    doSomething();
    console.timeEnd('doSomething()')
}

doingSomething();