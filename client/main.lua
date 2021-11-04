local itemsList = nil

RegisterNetEvent('menu:sendItems', function (items)
    itemsList = items
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'open-menu',
        itemsList = itemsList
    })
end)

RegisterCommand('open-menu', function()
    Menu.TriggerServerEvent('menu:getItems')
end)

RegisterNUICallback("close-menu", function(data)
    SetNuiFocus(false, false)
    SendNUIMessage({
        action = 'close-menu'
    })
end)

RegisterNUICallback("give-item", function(data)
    SetNuiFocus(false, false)
    SendNUIMessage({
        action = 'close-menu'
    })

    Menu.TriggerServerEvent('menu:giveItem', data.item, data.amount)
end)

RegisterNUICallback("create-item", function(data)
    SetNuiFocus(false, false)
    SendNUIMessage({
        action = 'close-menu'
    })

    Menu.TriggerServerEvent('menu:createItem', data.name, data.label, data.weight, data.limit)
end)

RegisterKeyMapping('open-menu', 'Open Menu', 'keyboard', 'm')