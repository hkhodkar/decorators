export function ClassDecorator(_: Function) {
    console.log('Class Decorator Logging .....');
}

interface ValidatorConfig {
    [property: string]: {
        [validatableProp: string]: string[]; // ['required', 'positive']
    };
}



function FactoryDecorator(loggingText: string) {
    return function (_: Function) {
        console.log(loggingText);
    }
}

function FactoryTemplateDecorator(template: string, hookId: string) {
    return function (_: Function) {
        console.log('Factory Template');
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
            hookEl.innerHTML = template;
        }
    }
}

function PropertyDecorator(target: any, propertyName: string | Symbol) {
    console.log('Property Decorator');
    console.log(target, propertyName);
}

function PropertyAccessorDecorator(target: any, name: string, descriptor: PropertyDescriptor) {
    console.log('Property Accessor Decorator');
    console.log(target);
    console.log(name);
    console.log(descriptor);
}

function MethodDecorator(target: any, name: string, descriptor: PropertyDescriptor) {
    console.log('Method Decorator');
    console.log(target);
    console.log(name);
    console.log(descriptor);
}

function ParameterDecorator(target: any, name: string | Symbol, position: number) {
    console.log('parameter Decorator');
    console.log(target);
    console.log(name);
    console.log(position);
}

function AutoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjustDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    }
    return adjustDescriptor;
}



const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        [propName]: ['required']
    };
}

function PositiveNumber(target: any, propName: string) {
    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        [propName]: ['positive']
    };
}

function validate(obj: any) {
    const objValidatorConfig = registeredValidators[obj.constructor.name];
    if (!objValidatorConfig) {
        return true;
    }
    let isValid = true;
    for (const prop in objValidatorConfig) {
        for (const validator of objValidatorConfig[prop]) {
            switch (validator) {
                case 'required':
                    isValid = isValid && !!obj[prop];
                    break;
                case 'positive':
                    isValid = isValid && obj[prop] > 0;
                    break;
            }
        }
    }
    return isValid;
}


@ClassDecorator
@FactoryDecorator("Factory Decorator")
@FactoryTemplateDecorator("Hi Hatef", "app")
class Person {
    name = "hatef";
    constructor() {
        console.log('creating person object....');
    }
}

const person = new Person();
console.log(person);

class Product {
    constructor(t: string, p: number) {
        this.title = t;
        this._price = p;
        console.log(this.title);
    }

    @PropertyDecorator
    private title: string;

    private _price: number;


    @PropertyAccessorDecorator
    set price(value: number) {
        if (value > 0) {
            this._price = value;
        } else {
            throw ("The value is invalid");
        }
    }

    @MethodDecorator
    getPriceWithTax(@ParameterDecorator tax: number) {
        return this._price * (1 + tax);
    }
}

new Product('book', 10);

class Print {
    message = 'This works!'

    @AutoBind
    showMessage() {
        console.log(this.message);
    }
}

const p = new Print();
p.showMessage();

class Course {
    @Required
    title: string;
    @PositiveNumber
    price: number;

    constructor(t: string, p: number) {
        this.title = t;
        this.price = p;
    }
}

const button = document.querySelector('button');
button?.addEventListener('click', p.showMessage);

const titleEl = document.getElementById('title') as HTMLInputElement;
const priceEl = document.getElementById('price') as HTMLInputElement;
const courseForm = document.querySelector('form');
courseForm?.addEventListener('submit', event => {
    event.preventDefault();
    const title = titleEl.value;
    const price = +priceEl.value;
    const course = new Course(title, price);
    if (!validate(course)) {
        alert('Invalid input, please try again!')
        return;
    }
    courseForm.reset();
    console.log(course);
})