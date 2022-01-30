local itemsList = nil
local isAdmin = false

RegisterNetEvent('menu:sendItems', function(items)
    itemsList = items
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'open-menu',
        name = GetCurrentResourceName(),
        itemsList = itemsList,
        limit = Config.Limit,
        weight = Config.Weight
    })
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

    isAdmin = Menu.TriggerServerEvent('menu:isAdmin')

    if isAdmin then
        Menu.TriggerServerEvent('menu:giveItem', data.item, data.amount)
    end
end)

RegisterNUICallback("create-item", function(data)
    SetNuiFocus(false, false)
    SendNUIMessage({
        action = 'close-menu'
    })

    isAdmin = Menu.TriggerServerEvent('menu:isAdmin')

    if isAdmin then
        Menu.TriggerServerEvent('menu:createItem', data.name, data.label, data.weight, data.limit, data.isLimit, data.isWeight)
    end
end)

RegisterNUICallback("clear-inventory", function(data)
    SetNuiFocus(false, false)
    SendNUIMessage({
        action = 'close-menu'
    })

    isAdmin = Menu.TriggerServerEvent('menu:isAdmin')

    if isAdmin then
        Menu.TriggerServerEvent('menu:clearInventory')
    end
end)

RegisterCommand('open-menu', function()
    isAdmin = Menu.TriggerServerEvent('menu:isAdmin')

    if isAdmin then
        Menu.TriggerServerEvent('menu:getItems')
    end
end)

RegisterKeyMapping('open-menu', 'Open Menu', 'keyboard', Config.Key)