function Varidator(selector, option = {}) {
  var _this = this
  var formRules = {}

  function getParent(element, selector) {
       while(element.parentElement) {
        if (element.parentElement.matches(selector)) {
          return element.parentElement
        }
        element = element.parentElement;
       }
  }

  var VaridatorRules = {
    required: function(value) {
        return value ? undefined : 'Vui lòng nhập giá trị'
    },

    email: function(value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : 'Vui lòng nhập Email'
    },
    
    min: function(min) {
      return function(value) {
        return value.length >= min ? undefined : `Vui lòng nhập ${min} kí tự`
      }
    },
  }

  //lấy form element trong dom
  var formElement = document.querySelector(selector)

  
  // chỉ xữ lí khi có form element
  if (formElement) {
    var inputs = formElement.querySelectorAll('[name][rules]')
    
    for (var input of inputs) {
      var rules = input.getAttribute('rules').split('|')
      for (var rule of rules) {

        var isRuleHasValue = rule.includes(':');

        var ruleInfo
        if (isRuleHasValue) {
        ruleInfo = rule.split(':')
          rule = ruleInfo[0] 
        }

        var ruleFunc = VaridatorRules[rule]

        if(isRuleHasValue) {
          ruleFunc = ruleFunc(ruleInfo[1])
        }

        if(Array.isArray(formRules[input.name])) {
          formRules[input.name].push(ruleFunc)
        } else {
          formRules[input.name] = [ruleFunc]
        }

      }

      //lắng nghe các sự kiện (blur, change, ...)
      input.onblur = handleValidate;
      input.oninput = handleClearError;
    };
    
    function handleValidate(event) {
     var rules = formRules[event.target.name]
     var errorMessage;

      for(var rule of rules) {
        errorMessage = rule(event.target.value)
        if(errorMessage) break;
      }

     //xử lí khi có lỗi (render lỗi)
     if(errorMessage) {
      var formGroupElement = getParent(event.target,'.form-group')

      if(formGroupElement) {
        formGroupElement.classList.add('ivalid')
        var formMessage = formGroupElement.querySelector('.form-message')

        if(formMessage) {
          formMessage.innerText = errorMessage;
        }      
      }    
     }

     return !errorMessage
    };

   function handleClearError() {
    var formGroupElement = getParent(event.target,'.form-group')

    if(formGroupElement.classList.contains('ivalid')) {
      formGroupElement.classList.remove('ivalid')
      var formMessage = formGroupElement.querySelector('.form-message')

      if(formMessage) {
        formMessage.innerText = '';
      }      
    }  
   }

   formElement.onsubmit = function(event) {
    event.preventDefault()
     
    var inputs = formElement.querySelectorAll('[name][rules]')
    var isValid = true;
    for (var input of inputs) {
      if(!handleValidate({ target: input})) {
        isValid = false;
      }
    }
    

    //xử lí khi không có lỗi 
    if (isValid) {
      if(typeof _this.onSubmit === 'function') {

        var enableInput = document.querySelectorAll("[name]");
        var formValue = Array.from(enableInput).reduce(function (
          value,
          input
        ) {
          value[input.name] = input.value;
          return value;
        },
        {});

        _this.onSubmit(formValue)
      } else {
        formElement.submit()
      }
    }


    
   }
  }

  
}






var form = new Varidator('#register-form')

form.onSubmit = function(data) {
  console.log(data)
}


