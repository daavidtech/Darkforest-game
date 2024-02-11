//
//  ContentView.swift
//  Darkforest
//
//  Created by Jaska on 11.2.2024.
//

import SwiftUI

struct ActivityItem: Identifiable {
    var id = UUID()
    var name: String
    var completedAt: Date
}

struct ActivityItemView: View {
    var item: ActivityItem
    @State private var now = Date()
    @State private var isHovering = false
    
    var body: some View {
        HStack {
            Text("Building")
            Text(timeRemaining(until: item.completedAt))
                .onAppear {
                    Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { _ in
                        now = Date() // Update the current time
                    }
                }
            Text("-")
            Text(item.name)
        }
        .background(isHovering ? Color.gray.opacity(0.2) : Color.clear)
        .onHover(perform: { hovering in
            isHovering = hovering
        })
    }
    
    private func timeRemaining(until endDate: Date) -> String {
        let calendar = Calendar.current
        let components = calendar.dateComponents([.hour, .minute, .second], from: now, to: endDate)
        let hour = components.hour ?? 0
        let minute = components.minute ?? 0
        let second = components.second ?? 0
        return String(format: "%02d:%02d:%02d", hour, minute, second)
    }
}

struct ContentView: View {
    var items = [
        ActivityItem(name: "Library", completedAt: Calendar.current.date(byAdding: .minute, value: 5, to: Date())!),
        ActivityItem(name: "Barrack", completedAt: Calendar.current.date(byAdding: .minute, value: 5, to: Date())!)
    ]
    
    var body: some View {
        ZStack {
            Image("background")
                .resizable()
                .clipped()
                .edgesIgnoringSafeArea(/*@START_MENU_TOKEN@*/.all/*@END_MENU_TOKEN@*/)
            VStack {
                Image(systemName: "globe")
                    .imageScale(.large)
                    .foregroundStyle(.tint)
                Text("Hello, world!!!!!")
                    .foregroundColor(.white)
                List(items) {item in
                    ActivityItemView(item: item)
                }
            }
            .frame(maxWidth: .infinity) // This line ensures the VStack takes the full width
            .padding()
        }
    }
}

#Preview {
    ContentView()
}
