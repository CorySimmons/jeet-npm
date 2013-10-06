stylus = require "stylus"
fs = require "fs"
autoprefixer = require "autoprefixer"

exports = module.exports = (path) ->
    file = fs.readFileSync path + "custom.styl"
    stylus(file.toString(), { compress: true }).set('paths', [path]).render (err, css) ->
        if err
            msg = err.message.split "\n"
            fileline = msg.shift().split ":"
            linenumber = fileline.pop()

            filename = "custom.styl"
            if fileline[0] isnt "stylus"
                filename = fileline[0].split("/").pop()

            for i, line of msg
                msg[i] = "\x1B[0;1m" + line + "\x1B[0;0m" if line.charAt(1) is ">"

            msg.pop()
            msg.push("\x1B[0;31m" + msg.pop() + "\x1B[0;0m")
            console.log "\x1B[0;31mError\x1B[0;0m in\x1B[0;1m " + filename + "\x1B[0;0m on line \x1B[0;1m" + linenumber + "\x1B[0;0m"
            console.log "````````````````````````````````````"
            console.log msg.join("\n")
            console.log "````````````````````````````````````"
        else
            fs.writeFile path + "custom.css", autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7").compile(css), () ->
                console.log "Recompiled custom.styl"
