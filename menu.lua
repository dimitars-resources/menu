-- Credit to: chezza#1234
Menu = {}
Server = IsDuplicityVersion()

if Server then 
    Menu.RegisterEvent = function (name, fn)
        RegisterNetEvent(('menu-events:%s'):format(name), function (id, ...)
            local src = source
            TriggerClientEvent(('menu-events:%s:%s'):format(name, id), src, fn(src, ...))
        end)
    end
end

if not Server then 
    local id = GetPlayerServerId(PlayerId())

    Menu.TriggerServerEvent = function (name, ...)
        local p = promise.new()

		SetTimeout(5000, function()
			p:reject({err="Event not Found!"})
		end)

        local handler = RegisterNetEvent(('menu-events:%s:%s'):format(name, id), function (...)
            p:resolve({...})
        end)

        TriggerServerEvent(('menu-events:%s'):format(name), id, ...)

        local data = Citizen.Await(p)
        RemoveEventHandler(handler)
        return table.unpack(data)
    end
end
