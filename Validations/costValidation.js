const yup = require('yup')

const apparelSchema = yup.object({
    title: yup.string().required(),
    // fashionType : yup.array(),
    fashionDescription : yup.string(),
    top : yup.object().shape({
        
        product: yup.string(),
        price: yup.number(),
        
    }),
    bottom: yup.object().shape({
        
        product: yup.string(),
        price: yup.number(),
        
    }),
    
})

module.exports = apparelSchema