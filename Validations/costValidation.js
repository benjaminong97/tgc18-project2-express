const yup = require('yup')

const apparelSchema = yup.object({
    title: yup.string().required(),
    // fashionType : yup.array(),
    fashionDescription : yup.string().required().max(160),
    top : yup.object().shape({
        topName : yup.string(),
        topCost: yup.number(),
        topInstructions: yup.string()
    }),
    bottom: yup.object().shape({
        bottomName : yup.string(),
        bottomCost: yup.number(),
        bottomInstructions: yup.string()
    }),
    contributor: yup.string().required(),
    outfitImage: yup.string().required(),
    tags: yup.array(),
    shoes: yup.object().shape({
        shoesName: yup.string(),
        shoesCost: yup.number(),
        shoesInstructions: yup.string()
    }),
    accessories: yup.object().shape({
        accessoriesName: yup.string(),
        accessoriesCost: yup.number(),
        accessoriesInstructions: yup.string(),
        accessoriesPresent: yup.boolean()
    })

    
})

module.exports = apparelSchema