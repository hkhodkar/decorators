var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
export function ClassDecorator(_) {
    console.log('Class Decorator Logging .....');
}
function FactoryDecorator(loggingText) {
    return function (_) {
        console.log(loggingText);
    };
}
function FactoryTemplateDecorator(template, hookId) {
    return function (_) {
        console.log('Factory Template');
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
            hookEl.innerHTML = template;
        }
    };
}
function PropertyDecorator(target, propertyName) {
    console.log('Property Decorator');
    console.log(target, propertyName);
}
function PropertyAccessorDecorator(target, name, descriptor) {
    console.log('Property Accessor Decorator');
    console.log(target);
    console.log(name);
    console.log(descriptor);
}
function MethodDecorator(target, name, descriptor) {
    console.log('Method Decorator');
    console.log(target);
    console.log(name);
    console.log(descriptor);
}
function ParameterDecorator(target, name, position) {
    console.log('parameter Decorator');
    console.log(target);
    console.log(name);
    console.log(position);
}
function AutoBind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjustDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjustDescriptor;
}
const registeredValidators = {};
function Required(target, propName) {
    registeredValidators[target.constructor.name] = Object.assign(Object.assign({}, registeredValidators[target.constructor.name]), { [propName]: ['required'] });
}
function PositiveNumber(target, propName) {
    registeredValidators[target.constructor.name] = Object.assign(Object.assign({}, registeredValidators[target.constructor.name]), { [propName]: ['positive'] });
}
function validate(obj) {
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
let Person = class Person {
    constructor() {
        this.name = "hatef";
        console.log('creating person object....');
    }
};
Person = __decorate([
    ClassDecorator,
    FactoryDecorator("Factory Decorator"),
    FactoryTemplateDecorator("Hi Hatef", "app")
], Person);
const person = new Person();
console.log(person);
class Product {
    constructor(t, p) {
        this.title = t;
        this._price = p;
        console.log(this.title);
    }
    set price(value) {
        if (value > 0) {
            this._price = value;
        }
        else {
            throw ("The value is invalid");
        }
    }
    getPriceWithTax(tax) {
        return this._price * (1 + tax);
    }
}
__decorate([
    PropertyDecorator
], Product.prototype, "title", void 0);
__decorate([
    PropertyAccessorDecorator
], Product.prototype, "price", null);
__decorate([
    MethodDecorator,
    __param(0, ParameterDecorator)
], Product.prototype, "getPriceWithTax", null);
new Product('book', 10);
class Print {
    constructor() {
        this.message = 'This works!';
    }
    showMessage() {
        console.log(this.message);
    }
}
__decorate([
    AutoBind
], Print.prototype, "showMessage", null);
const p = new Print();
p.showMessage();
class Course {
    constructor(t, p) {
        this.title = t;
        this.price = p;
    }
}
__decorate([
    Required
], Course.prototype, "title", void 0);
__decorate([
    PositiveNumber
], Course.prototype, "price", void 0);
const button = document.querySelector('button');
button === null || button === void 0 ? void 0 : button.addEventListener('click', p.showMessage);
const titleEl = document.getElementById('title');
const priceEl = document.getElementById('price');
const courseForm = document.querySelector('form');
courseForm === null || courseForm === void 0 ? void 0 : courseForm.addEventListener('submit', event => {
    event.preventDefault();
    const title = titleEl.value;
    const price = +priceEl.value;
    const course = new Course(title, price);
    if (!validate(course)) {
        alert('Invalid input, please try again!');
        return;
    }
    courseForm.reset();
    console.log(course);
});
//# sourceMappingURL=app.js.map