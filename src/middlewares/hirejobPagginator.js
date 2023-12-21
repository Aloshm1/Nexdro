let  paginatedResults1 = (model) =>{
    return async (req, res, next) => {
      const page = parseInt(req.query.page)
      const limit = 20;
  
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
  
      const results = {}
  
      if (endIndex < await model.countDocuments().exec()) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }
      
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }
      try {
        
        results.results = await model.find({status: true}).sort({ createdAt: -1 }).limit(limit).skip(startIndex).exec()
        res.paginatedResults1 = results
        next()
      } catch (e) {
        res.status(500).json({ message: e.message })
      }
    }
  }

  module.exports = paginatedResults1